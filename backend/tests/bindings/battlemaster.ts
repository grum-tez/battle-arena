import * as ex from "@completium/experiment-ts";
import * as att from "@completium/archetype-ts-types";
import * as el from "@completium/event-listener";
export class c_mode_updated implements att.ArchetypeType {
    constructor(public challenger_elf: att.Address, public c_mode_on: att.Nat) { }
    toString(): string {
        return JSON.stringify(this, null, 2);
    }
    to_mich(): att.Micheline {
        return att.pair_to_mich([this.challenger_elf.to_mich(), this.c_mode_on.to_mich()]);
    }
    equals(v: c_mode_updated): boolean {
        return att.micheline_equals(this.to_mich(), v.to_mich());
    }
    static from_mich(input: att.Micheline): c_mode_updated {
        return new c_mode_updated(att.Address.from_mich((input as att.Mpair).args[0]), att.Nat.from_mich((input as att.Mpair).args[1]));
    }
}
export class new_challenger_registered implements att.ArchetypeType {
    constructor(public new_challenger_address: att.Address, public new_challenger_fighter_id: att.Nat, public new_challenger_fight_history: Array<fight_record>, public new_challenger_fight_count: att.Nat, public new_challenger_c_mode: att.Nat) { }
    toString(): string {
        return JSON.stringify(this, null, 2);
    }
    to_mich(): att.Micheline {
        return att.pair_to_mich([this.new_challenger_address.to_mich(), this.new_challenger_fighter_id.to_mich(), att.list_to_mich(this.new_challenger_fight_history, x => {
                return x.to_mich();
            }), this.new_challenger_fight_count.to_mich(), this.new_challenger_c_mode.to_mich()]);
    }
    equals(v: new_challenger_registered): boolean {
        return att.micheline_equals(this.to_mich(), v.to_mich());
    }
    static from_mich(input: att.Micheline): new_challenger_registered {
        return new new_challenger_registered(att.Address.from_mich(input[0]), att.Nat.from_mich(input[1]), att.mich_to_list(input[2], x => { return fight_record.from_mich(x); }), att.Nat.from_mich(input[3]), att.Nat.from_mich(input[4]));
    }
}
export class new_fight_recorded implements att.ArchetypeType {
    constructor(public challenger_address: att.Address, public new_fight_record: fight_record) { }
    toString(): string {
        return JSON.stringify(this, null, 2);
    }
    to_mich(): att.Micheline {
        return att.pair_to_mich([this.challenger_address.to_mich(), this.new_fight_record.to_mich()]);
    }
    equals(v: new_fight_recorded): boolean {
        return att.micheline_equals(this.to_mich(), v.to_mich());
    }
    static from_mich(input: att.Micheline): new_fight_recorded {
        return new new_fight_recorded(att.Address.from_mich((input as att.Mpair).args[0]), fight_record.from_mich(att.pair_to_mich((input as att.Mpair as att.Mpair).args.slice(1, 7))));
    }
}
export class fight_record implements att.ArchetypeType {
    constructor(public fight_timestamp: Date, public battlemaster_victorious: boolean, public battlemaster_fighter_id: att.Nat, public battlemaster_fighter_name: string, public challenger_fighter_id: att.Nat, public challenger_fighter_name: string) { }
    toString(): string {
        return JSON.stringify(this, null, 2);
    }
    to_mich(): att.Micheline {
        return att.pair_to_mich([att.date_to_mich(this.fight_timestamp), att.bool_to_mich(this.battlemaster_victorious), this.battlemaster_fighter_id.to_mich(), att.string_to_mich(this.battlemaster_fighter_name), this.challenger_fighter_id.to_mich(), att.string_to_mich(this.challenger_fighter_name)]);
    }
    equals(v: fight_record): boolean {
        return att.micheline_equals(this.to_mich(), v.to_mich());
    }
    static from_mich(input: att.Micheline): fight_record {
        return new fight_record(att.mich_to_date((input as att.Mpair).args[0]), att.mich_to_bool((input as att.Mpair).args[1]), att.Nat.from_mich((input as att.Mpair).args[2]), att.mich_to_string((input as att.Mpair).args[3]), att.Nat.from_mich((input as att.Mpair).args[4]), att.mich_to_string((input as att.Mpair).args[5]));
    }
}
export const fight_record_mich_type: att.MichelineType = att.pair_array_to_mich_type([
    att.prim_annot_to_mich_type("timestamp", ["%fight_timestamp"]),
    att.prim_annot_to_mich_type("bool", ["%battlemaster_victorious"]),
    att.prim_annot_to_mich_type("nat", ["%battlemaster_fighter_id"]),
    att.prim_annot_to_mich_type("string", ["%battlemaster_fighter_name"]),
    att.prim_annot_to_mich_type("nat", ["%challenger_fighter_id"]),
    att.prim_annot_to_mich_type("string", ["%challenger_fighter_name"])
], []);
export const fighters_map_key_mich_type: att.MichelineType = att.prim_annot_to_mich_type("nat", []);
export const challengers_big_map_key_mich_type: att.MichelineType = att.prim_annot_to_mich_type("address", []);
export class fighters_map_value implements att.ArchetypeType {
    constructor(public name: string, public strength: att.Nat, public hidden: boolean, public ipfsHash: string) { }
    toString(): string {
        return JSON.stringify(this, null, 2);
    }
    to_mich(): att.Micheline {
        return att.pair_to_mich([att.string_to_mich(this.name), this.strength.to_mich(), att.bool_to_mich(this.hidden), att.string_to_mich(this.ipfsHash)]);
    }
    equals(v: fighters_map_value): boolean {
        return att.micheline_equals(this.to_mich(), v.to_mich());
    }
    static from_mich(input: att.Micheline): fighters_map_value {
        return new fighters_map_value(att.mich_to_string((input as att.Mpair).args[0]), att.Nat.from_mich((input as att.Mpair).args[1]), att.mich_to_bool((input as att.Mpair).args[2]), att.mich_to_string((input as att.Mpair).args[3]));
    }
}
export class challengers_big_map_value implements att.ArchetypeType {
    constructor(public chosen_fighter_id: att.Nat, public fightHistory: Array<fight_record>, public fightCount: att.Nat, public c_mode: att.Nat) { }
    toString(): string {
        return JSON.stringify(this, null, 2);
    }
    to_mich(): att.Micheline {
        return att.pair_to_mich([this.chosen_fighter_id.to_mich(), att.list_to_mich(this.fightHistory, x => {
                return x.to_mich();
            }), this.fightCount.to_mich(), this.c_mode.to_mich()]);
    }
    equals(v: challengers_big_map_value): boolean {
        return att.micheline_equals(this.to_mich(), v.to_mich());
    }
    static from_mich(input: att.Micheline): challengers_big_map_value {
        return new challengers_big_map_value(att.Nat.from_mich((input as att.Mpair).args[0]), att.mich_to_list((input as att.Mpair).args[1], x => { return fight_record.from_mich(x); }), att.Nat.from_mich((input as att.Mpair).args[2]), att.Nat.from_mich((input as att.Mpair).args[3]));
    }
}
export const fighters_map_value_mich_type: att.MichelineType = att.pair_array_to_mich_type([
    att.prim_annot_to_mich_type("string", ["%name"]),
    att.prim_annot_to_mich_type("nat", ["%strength"]),
    att.prim_annot_to_mich_type("bool", ["%hidden"]),
    att.prim_annot_to_mich_type("string", ["%ipfsHash"])
], []);
export const challengers_big_map_value_mich_type: att.MichelineType = att.pair_array_to_mich_type([
    att.prim_annot_to_mich_type("nat", ["%chosen_fighter_id"]),
    att.list_annot_to_mich_type(att.pair_array_to_mich_type([
        att.prim_annot_to_mich_type("timestamp", ["%fight_timestamp"]),
        att.prim_annot_to_mich_type("bool", ["%battlemaster_victorious"]),
        att.prim_annot_to_mich_type("nat", ["%battlemaster_fighter_id"]),
        att.prim_annot_to_mich_type("string", ["%battlemaster_fighter_name"]),
        att.prim_annot_to_mich_type("nat", ["%challenger_fighter_id"]),
        att.prim_annot_to_mich_type("string", ["%challenger_fighter_name"])
    ], []), ["%fightHistory"]),
    att.prim_annot_to_mich_type("nat", ["%fightCount"]),
    att.prim_annot_to_mich_type("nat", ["%c_mode"])
], []);
export type fighters_map_container = Array<[
    att.Nat,
    fighters_map_value
]>;
export type challengers_big_map_container = Array<[
    att.Address,
    challengers_big_map_value
]>;
export const fighters_map_container_mich_type: att.MichelineType = att.pair_annot_to_mich_type("map", att.prim_annot_to_mich_type("nat", []), att.pair_array_to_mich_type([
    att.prim_annot_to_mich_type("string", ["%name"]),
    att.prim_annot_to_mich_type("nat", ["%strength"]),
    att.prim_annot_to_mich_type("bool", ["%hidden"]),
    att.prim_annot_to_mich_type("string", ["%ipfsHash"])
], []), []);
export const challengers_big_map_container_mich_type: att.MichelineType = att.pair_annot_to_mich_type("big_map", att.prim_annot_to_mich_type("address", []), att.pair_array_to_mich_type([
    att.prim_annot_to_mich_type("nat", ["%chosen_fighter_id"]),
    att.list_annot_to_mich_type(att.pair_array_to_mich_type([
        att.prim_annot_to_mich_type("timestamp", ["%fight_timestamp"]),
        att.prim_annot_to_mich_type("bool", ["%battlemaster_victorious"]),
        att.prim_annot_to_mich_type("nat", ["%battlemaster_fighter_id"]),
        att.prim_annot_to_mich_type("string", ["%battlemaster_fighter_name"]),
        att.prim_annot_to_mich_type("nat", ["%challenger_fighter_id"]),
        att.prim_annot_to_mich_type("string", ["%challenger_fighter_name"])
    ], []), ["%fightHistory"]),
    att.prim_annot_to_mich_type("nat", ["%fightCount"]),
    att.prim_annot_to_mich_type("nat", ["%c_mode"])
], []), []);
const toggle_c_mode_arg_to_mich = (): att.Micheline => {
    return att.unit_mich;
}
const register_challenger_arg_to_mich = (fighter_id_requested: att.Nat): att.Micheline => {
    return fighter_id_requested.to_mich();
}
const fight_arg_to_mich = (): att.Micheline => {
    return att.unit_mich;
}
export class Battlemaster {
    address: string | undefined;
    constructor(address: string | undefined = undefined) {
        this.address = address;
    }
    get_address(): att.Address {
        if (undefined != this.address) {
            return new att.Address(this.address);
        }
        throw new Error("Contract not initialised");
    }
    async get_balance(): Promise<att.Tez> {
        if (null != this.address) {
            return await ex.get_balance(new att.Address(this.address));
        }
        throw new Error("Contract not initialised");
    }
    async deploy(battle_master_fighter_id: att.Nat, params: Partial<ex.Parameters>) {
        const address = (await ex.deploy("./contracts/battlemaster.arl", {
            battle_master_fighter_id: battle_master_fighter_id.to_mich()
        }, params)).address;
        this.address = address;
    }
    async toggle_c_mode(params: Partial<ex.Parameters>): Promise<att.CallResult> {
        if (this.address != undefined) {
            return await ex.call(this.address, "toggle_c_mode", toggle_c_mode_arg_to_mich(), params);
        }
        throw new Error("Contract not initialised");
    }
    async register_challenger(fighter_id_requested: att.Nat, params: Partial<ex.Parameters>): Promise<att.CallResult> {
        if (this.address != undefined) {
            return await ex.call(this.address, "register_challenger", register_challenger_arg_to_mich(fighter_id_requested), params);
        }
        throw new Error("Contract not initialised");
    }
    async fight(params: Partial<ex.Parameters>): Promise<att.CallResult> {
        if (this.address != undefined) {
            return await ex.call(this.address, "fight", fight_arg_to_mich(), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_toggle_c_mode_param(params: Partial<ex.Parameters>): Promise<att.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "toggle_c_mode", toggle_c_mode_arg_to_mich(), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_register_challenger_param(fighter_id_requested: att.Nat, params: Partial<ex.Parameters>): Promise<att.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "register_challenger", register_challenger_arg_to_mich(fighter_id_requested), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_fight_param(params: Partial<ex.Parameters>): Promise<att.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "fight", fight_arg_to_mich(), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_battle_master_fighter_id(): Promise<att.Nat> {
        if (this.address != undefined) {
            const storage = await ex.get_raw_storage(this.address);
            return att.Nat.from_mich((storage as att.Mpair).args[0]);
        }
        throw new Error("Contract not initialised");
    }
    async get_fighters_map(): Promise<fighters_map_container> {
        if (this.address != undefined) {
            const storage = await ex.get_raw_storage(this.address);
            return att.mich_to_map((storage as att.Mpair).args[1], (x, y) => [att.Nat.from_mich(x), fighters_map_value.from_mich(y)]);
        }
        throw new Error("Contract not initialised");
    }
    async get_challengers_big_map_value(key: att.Address): Promise<challengers_big_map_value | undefined> {
        if (this.address != undefined) {
            const storage = await ex.get_raw_storage(this.address);
            const data = await ex.get_big_map_value(BigInt(att.Int.from_mich((storage as att.Mpair).args[2]).toString()), key.to_mich(), challengers_big_map_key_mich_type);
            if (data != undefined) {
                return challengers_big_map_value.from_mich(data);
            }
            else {
                return undefined;
            }
        }
        throw new Error("Contract not initialised");
    }
    async has_challengers_big_map_value(key: att.Address): Promise<boolean> {
        if (this.address != undefined) {
            const storage = await ex.get_raw_storage(this.address);
            const data = await ex.get_big_map_value(BigInt(att.Int.from_mich((storage as att.Mpair).args[2]).toString()), key.to_mich(), challengers_big_map_key_mich_type);
            if (data != undefined) {
                return true;
            }
            else {
                return false;
            }
        }
        throw new Error("Contract not initialised");
    }
    async get_count(): Promise<att.Nat> {
        if (this.address != undefined) {
            const storage = await ex.get_raw_storage(this.address);
            return att.Nat.from_mich((storage as att.Mpair).args[3]);
        }
        throw new Error("Contract not initialised");
    }
    register_c_mode_updated(ep: el.EventProcessor<c_mode_updated>) {
        if (this.address != undefined) {
            el.registerEvent({ source: this.address, filter: tag => { return tag == "c_mode_updated"; }, process: (raw: any, data: el.EventData | undefined) => {
                    const event = (x => {
                        return c_mode_updated.from_mich((att.normalize(x) as att.Micheline));
                    })(raw);
                    ep(event, data);
                } });
            return;
        }
        throw new Error("Contract not initialised");
    }
    register_new_challenger_registered(ep: el.EventProcessor<new_challenger_registered>) {
        if (this.address != undefined) {
            el.registerEvent({ source: this.address, filter: tag => { return tag == "new_challenger_registered"; }, process: (raw: any, data: el.EventData | undefined) => {
                    const event = (x => {
                        return new_challenger_registered.from_mich((att.normalize(x) as att.Micheline));
                    })(raw);
                    ep(event, data);
                } });
            return;
        }
        throw new Error("Contract not initialised");
    }
    register_new_fight_recorded(ep: el.EventProcessor<new_fight_recorded>) {
        if (this.address != undefined) {
            el.registerEvent({ source: this.address, filter: tag => { return tag == "new_fight_recorded"; }, process: (raw: any, data: el.EventData | undefined) => {
                    const event = (x => {
                        return new_fight_recorded.from_mich((att.normalize(x) as att.Micheline));
                    })(raw);
                    ep(event, data);
                } });
            return;
        }
        throw new Error("Contract not initialised");
    }
    errors = {
        OPTION_IS_NONE: att.string_to_mich("\"OPTION_IS_NONE\""),
        NO_CHALLENGER_MAY_FEED_MORE_THAN_100_FIGHTERS_TO_THE_DRAGON: att.string_to_mich("\"No challenger may feed more than 100 fighters to the dragon\""),
        fight_r1: att.string_to_mich("\"You are not a registered challenger.\""),
        THAT_CHALLENGER_HAS_NOT_BEEN_REGISTERED: att.string_to_mich("\"That challenger has not been registered\""),
        register_challenger_r1: att.string_to_mich("\"There is no fighter with the requested id.\""),
        toggle_c_mode_r1: att.string_to_mich("\"You can't change the mode of a user who is not registered\"")
    };
}
export const battlemaster = new Battlemaster();
