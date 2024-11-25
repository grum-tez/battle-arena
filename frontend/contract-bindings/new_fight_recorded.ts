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
        // console.log("new_fight_recorded.from_mich input:", JSON.stringify(input, null, 2));

        let args: att.Micheline[];
        if (Array.isArray(input)) {
            args = input;
        } else {
            args = (input as att.Mpair).args;
        }

        // console.log("new_fight_recorded.from_mich args:", JSON.stringify(args, null, 2));

        const challenger_address = att.Address.from_mich(args[0]);
        const new_fight_record = fight_record.from_mich(att.pair_to_mich(args.slice(1)));

        // console.log("new_fight_recorded.from_mich parsed:", {
        //     challenger_address: challenger_address.toString(),
        //     new_fight_record: JSON.stringify(new_fight_record, null, 2)
        // });

        return new new_fight_recorded(challenger_address, new_fight_record);
    }
}