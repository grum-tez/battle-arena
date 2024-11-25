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
        // console.log("fight_record.from_mich input:", JSON.stringify(input, null, 2));
        try {
            const int_mich_to_date = (x: att.Micheline): Date => {
                const timestamp = parseInt((x as att.Mint)["int"]) * 1000;
                return new Date(timestamp);
            }

            const mixed_mich_to_date = (x: att.Micheline): Date => {
                if ('int' in (x as att.Mint)) {
                    return int_mich_to_date(x as att.Mint);
                } else if ('string' in (x as att.Mstring)) {
                    return att.mich_to_date(x as att.Mstring);
                } else {
                    throw new Error("Unexpected Micheline type for date conversion");
                }
            }

            let args: att.Micheline[];
            if (Array.isArray(input)) {
                args = input;
            } else {
                args = (input as att.Mpair).args;
            }
            // console.log("raw timestamp:")
            // console.log(args[0])
            // console.log(mixed_mich_to_date(args[0]))

            const result = new fight_record(
                mixed_mich_to_date(args[0]),
                att.mich_to_bool(args[1]),
                att.Nat.from_mich(args[2]),
                att.mich_to_string(args[3]),
                att.Nat.from_mich(args[4]),
                att.mich_to_string(args[5])
            );
            // console.log("fight_record.from_mich result:", JSON.stringify(result, null, 2));
            return result;
        } catch (error) {
            console.error("Error in fight_record.from_mich:", error);
            throw error;
        }
    }
}