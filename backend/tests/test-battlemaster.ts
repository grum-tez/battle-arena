import { get_account, set_quiet, set_mockup } from "@completium/experiment-ts"
import assert from "assert"
import { battlemaster, new_challenger_registered, c_mode_updated, new_fight_recorded, Battlemaster } from "./bindings/battlemaster"
import { Nat } from "@completium/archetype-ts-types"

set_mockup()

// silence completium output:
set_quiet(true)

const alice = get_account("alice")
const bob = get_account("bob")

describe("BattleMaster Contract Initialisation", async () => {
  it("Contract deploys", async () => {
    await battlemaster.deploy(new Nat(6), { as: alice })
  })
})

describe("BattleMaster Contract Event Debugging", async () => {
  it("Logs new_challenger_registered event", async () => {
    const res = await battlemaster.register_challenger(new Nat(2), { as: bob });
    assert(res.events.length > 0, "No events were emitted");
    assert(res.events[0].tag === "new_challenger_registered", "Unexpected event type");
    const eventPayload = res.events[0].payload
    // assert(event.new_challenger_address.equals(bob.get_address()), "Unexpected challenger address in event");
  });
});

describe("BattleMaster Contract Fight Event Logging", async () => {
  it("Logs new_fight_recorded event", async () => {
    // First, register Bob as a challenger if not already registered
    console.log("Check bob is in challengers big map")
    if (!(await battlemaster.has_challengers_big_map_value(bob.get_address()))) {
      console.log("bob is not in the big map. Call register_challenger as bob")
      await battlemaster.register_challenger(new Nat(2), { as: bob })
    }

    // Now challenge the battlemaster
    console.log("Call fight as bob")
    const res = await battlemaster.fight({ as: bob });
    assert(res.events.length > 0, "No events were emitted");
    assert(res.events[0].tag === "new_fight_recorded", "Unexpected event type");
    console.log("Get event payload")
    const eventPayload = res.events[0].payload;
    console.log("create new_fight_recorded class from mich of eventPayload")
    const from_mich_event = new_fight_recorded.from_mich(eventPayload);

    console.log("from_mich_event: ", from_mich_event);
  });
})



describe("BattleMaster Contract Validation", async () => {

  it("Registration fails for a challenger with invalid fighter ID", async () => {
    try {
      await battlemaster.register_challenger(new Nat(999), { as: bob })
      assert.fail("Challenger registration should have failed")
    } catch (e: any) {
      assert(e.value.includes("There is no fighter with the requested id."), "Error message should indicate invalid fighter ID")
    }
  })
  
  it("Register succeeds for a challenger with valid fighter ID", async () => {
    try {
      await battlemaster.register_challenger(new Nat(2), { as: bob })
      const bobChallenger = await battlemaster.get_challengers_big_map_value(bob.get_address())
      assert(bobChallenger !== undefined, "Challenger should be registered")
      assert(bobChallenger!.chosen_fighter_id.equals(new Nat(2)), "Challenger fighter ID should be 2")
    } catch (e: any) {
      assert.fail("Challenger registration failed: " + e.message)
    }
  })
})

describe("BattleMaster Contract C-Mode Tests", async () => {
  it("Toggle C-Mode fails for unregistered challenger", async () => {
    try {
      await battlemaster.toggle_c_mode({ as: alice })
      assert.fail("Toggle C-Mode should have failed for unregistered challenger")
    } catch (e: any) {
      assert(e.value.includes("You can't change the mode of a user who is not registered"), "Error message should indicate unregistered user")
    }
  })

  it("Toggle C-Mode succeeds for registered challenger", async () => {
    // First, register Bob as a challenger if not already registered
    if (!(await battlemaster.has_challengers_big_map_value(bob.get_address()))) {
      await battlemaster.register_challenger(new Nat(2), { as: bob })
    }

    // Now toggle C-Mode
    const res = await battlemaster.toggle_c_mode({ as: bob })
    assert(res.events.length > 0, "No events were emitted")
    assert(res.events[0].tag === "c_mode_updated", "Unexpected event type")

    const eventPayload = res.events[0].payload
    const event = c_mode_updated.from_mich(eventPayload)
    assert(event.challenger_elf.equals(bob.get_address()), "Unexpected challenger address in event")
    
    // Check if C-Mode was actually toggled
    const bobChallenger = await battlemaster.get_challengers_big_map_value(bob.get_address())
    assert(bobChallenger !== undefined, "Challenger should be registered")
    assert(bobChallenger!.c_mode.equals(new Nat(1)), "C-Mode should be incremented to 1")

    // Toggle C-Mode back
    await battlemaster.toggle_c_mode({ as: bob })
    const updatedBobChallenger = await battlemaster.get_challengers_big_map_value(bob.get_address())
    assert(updatedBobChallenger!.c_mode.equals(new Nat(2)), "C-Mode should be incremented to 2")
  })
})

describe("BattleMaster Contract Fight Count Validation", async () => {
  it("Valid call to challenge_battlemaster updates challengers fight history", async () => {

      // Challenge the battlemaster
      await battlemaster.fight({ as: bob })
      const updatedBobChallenger = await battlemaster.get_challengers_big_map_value(bob.get_address())
      assert(updatedBobChallenger !== undefined, "Challenger should still be registered")
      assert(updatedBobChallenger!.fightHistory.length > 0, "Fight history should be updated")

  })
})


