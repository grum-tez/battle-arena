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
        let args: att.Micheline[];
        if (Array.isArray(input)) {
            args = input;
        } else {
            args = (input as att.Mpair).args;
        }

        const new_challenger_address = att.Address.from_mich(args[0]);
        const new_challenger_fighter_id = att.Nat.from_mich(args[1]);
        const new_challenger_fight_history = att.mich_to_list(args[2], x => fight_record.from_mich(x));
        const new_challenger_fight_count = att.Nat.from_mich(args[3]);
        const new_challenger_c_mode = att.Nat.from_mich(args[4]);

        return new new_challenger_registered(
            new_challenger_address,
            new_challenger_fighter_id,
            new_challenger_fight_history,
            new_challenger_fight_count,
            new_challenger_c_mode
        );
    }
}