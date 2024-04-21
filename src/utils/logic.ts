export type ConditionType = "select" | "text" | "number" | "date" | "none" | "list"
interface ICondition<Input, ID, EvalReturn, Child> {
    children: Child[]
    evaluate: (input: Input) => EvalReturn;
    id: ID;
    description: string;
    type: ConditionType;
}

export class Condition<Input, ID, EvalReturn, Child> implements ICondition<Input, ID, EvalReturn, Child> {
    evaluate: (input: Input) => EvalReturn;
    id: ID;
    description: string;
    children: Child[];
    type: ConditionType;
    constructor(
        id: ID,
        type: ConditionType,
        description: string,
        evaluate: (input: Input) => EvalReturn,
        children: Child[] = []) {
        this.id = id;
        this.type = type;
        this.description = description;
        this.children = children;
        this.evaluate = evaluate;
    }
}
// usage

function condition<Input, ID, EvalReturn, Child>(...args: ConstructorParameters<typeof Condition<Input, ID, EvalReturn, Child>>) {
    return new Condition(...args)
}

const ACCEPT = (a?: any) => true
const REJECT = (a?: any) => false
type VisaType = 'B-1' | 'B-2' | 'Other'

export const TravelRejection = [
    // Purpose of visit:
    condition('travelPurpose', 'select', 'Purpose of Travel', ACCEPT, [
        condition('B-1' as VisaType, 'none', 'Conduct Business', REJECT),
        condition('B-1' as VisaType, 'none', 'Attend a convention or conference', REJECT, [
            condition('Convention', 'select', 'Type of Convention', ACCEPT, [
                condition('Scientific', 'none', 'Scientific', REJECT),
                condition('Educational', 'none', 'Educational', REJECT),
                condition('Professional', 'none', 'Professional', REJECT),
                condition('Business', 'none', 'Business', REJECT),
            ]),
        ]),
        condition('B-1' as VisaType, 'none', 'Settle an estate', REJECT),
        condition('B-1' as VisaType, 'none', 'Negotiate a contract', REJECT),

        condition('B-2' as VisaType, 'none', 'Tourism', ACCEPT),
        condition('B-2' as VisaType, 'none', 'Vacation (holiday)', ACCEPT),
        condition('B-2' as VisaType, 'none', 'Visit with friends or relatives', ACCEPT),
        condition('B-2' as VisaType, 'none', 'Medical treatment', ACCEPT),
        condition('B-2' as VisaType, 'none', 'Join social events', ACCEPT, [
            condition('Social Event', 'select', 'Type of Social Event', ACCEPT, [
                condition('Fraternal', 'none', 'Fraternal', ACCEPT),
                condition('Social', 'none', 'Social', ACCEPT),
                condition('Service', 'none', 'Service', ACCEPT),
            ]),
        ]),
        condition('B-2' as VisaType, 'none', 'Amateur participiation in unpaid events', ACCEPT, [
            condition('Amateur Event', 'select', 'Type of Amateur Event', ACCEPT, [
                condition('Musical', 'none', 'Musical', ACCEPT),
                condition('Sports', 'none', 'Sports', ACCEPT),
            ]),
        ]),
        condition('B-2' as VisaType, 'none', 'Enroll in a short recreational course of study, not for credit toward a degree', ACCEPT, [
            condition('Recreational Study', 'none', '2-day cooking class while on vacation', ACCEPT),
        ]),
        condition('Other' as VisaType, 'none', 'Study', REJECT),
        condition('Other' as VisaType, 'none', 'Employment', REJECT),
        condition('Other' as VisaType, 'none', 'Professional Performance before a paying audience', REJECT),
        condition('Other' as VisaType, 'none', 'Arrival as a crewmember', REJECT, [
            condition('Crewmember', 'select', 'Type of Crewmember', ACCEPT, [
                condition('ship', 'none', 'ship', REJECT),
                condition('aircraft', 'none', 'aircraft', REJECT),
            ]),
        ]),
    ]),
    condition('sex', 'select', 'Specify your sex', ACCEPT, [
        condition('sex', 'none', 'male', ACCEPT,),
        condition('sex', 'none', 'female', ACCEPT, [
            // are you pregnant
            condition('Pregnant', 'select', 'Are you pregnant?', ACCEPT, [
                condition('no', 'none', 'no', ACCEPT),
                condition('yes', 'none', 'yes', ACCEPT, [
                    // are you nearing pregnancy
                    condition('NearingPregnancy', 'select', 'Are you nearing pregnancy?', ACCEPT, [
                        condition('no', 'none', 'no', ACCEPT),
                        condition('yes', 'none', 'yes', REJECT),
                    ]),
                ]),
            ]),
        ]),
    ]),
    condition('Passport', 'select', 'Do you have a passport', ACCEPT, [
        condition('no', 'none', 'no', REJECT),
        condition('yes', 'none', 'yes', ACCEPT, [
            // passport validity of 6months
            condition('PassportExpiry', 'date', "Enter passport expiry",
                (n?: string) => {
                    if (n === undefined) {
                        return false
                    }
                    const given = Date.parse(n)
                    const today = new Date();
                    const sixMonths = new Date(today.setMonth(today.getMonth() + 6));
                    console.log(given, sixMonths)

                    return given > sixMonths.getTime()
                }),
        ]),
    ])
]

const ZERO = (n: any) => 0
const INCREASE = (n: any) => 1
const DECREASE = (n: any) => -1

export const ProvingTies = [
    condition('AnnualSalaryDollars', 'number', 'Annual Salary', (salaryInDollars:string) => {
        console.log({salaryInDollars})
        return parseInt(salaryInDollars) > 20000 ? 1: -1
    }),
    // are you married
    condition('marriage', 'select', 'Are you married?', ZERO, [
        condition('no', 'none', 'no', DECREASE),
        condition('yes', 'none', 'yes', ZERO,
            [
                // how many children
                condition('children', 'number', 'How many children', (children:string) => {
                    console.log({children})
                    return parseInt(children) > 0 ? 1: -1
                }),
            ]
        ),
    ]),
    // School Enrollment
    condition('SchoolEnrollment', 'select', 'Are you enrolled in school?', ZERO, [
        condition('no', 'none', 'no', ZERO),
        condition('yes', 'none', 'yes', INCREASE),
    ]),
    // Volunteer Work
    // condition('VolunteerWork', 'text', 'List your volunteer work', INCREASE),
    // Organization Membership
    // condition('OrganizationMembership', 'text', 'List your organization memberships', INCREASE),
    // // Personal Assets
    // condition('Asset', 'list', 'List your personal assets', INCREASE, [
    //     condition('name', 'text', 'Name of Asset', INCREASE),
    //     condition('valueDollars', 'number', 'Value of Asset', INCREASE),
    //     condition('type', 'select', 'Type of Asset', INCREASE),
    // ]),
]

