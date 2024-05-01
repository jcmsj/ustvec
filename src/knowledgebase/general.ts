import { useData } from "../utils/schema"

export interface General {
    travelPurpose: 'ConductBusiness' | 'AttendConvention' | 'SettleEState' | 'Contract' | 'Tourism' | 'Vacation' | 'Visit' | 'MedicalTreatment' | 'JoinSocialevent' | 'Participate' | 'ShortStudy' | 'Study' | 'Employment' | 'ProfessionalPerformance' | 'ArrivalCrewmember'
    conventionType?: 'Scientific' | 'Educational' | 'Professional' | 'Business'
    socialEventType?: 'Fraternal' | 'Social'
    crewmemberType?: 'ship' | 'aircraft'
    passport: 'no' | 'yes'
    plannedEndDate?: Date
    visaAttempts : {
        failed: number
        success: number
    }
}
export const general = useData({
    id: 'general',
    $formkit: 'group',
    name: 'general',
    nested: [
        {
            $formkit: 'select',
            id: 'travelPurpose',
            label: 'Purpose of Travel',
            validation: "required|matches:Tourism,Vacation,Visit,MedicalTreatment,JoinSocialevent,Participate,ShortStudy",
            validationMessages: {
                matches: 'That is not valid reason for a Tourist VISA (B-2)'
            },
            options: [
                // B1
                { label: 'Select', value: '', attrs: { disabled: true } },
                { _type: 'B-1', label: 'Conduct Business', value: 'ConductBusiness' },
                { _type: 'B-1', label: 'Attend a convention or conference', value: 'AttendConvention' },
                { _type: 'B-1', label: 'Settle an estate', value: 'SettleEState' },
                { _type: 'B-1', label: 'Negotiate a contract', value: 'Contract' },

                // B2
                { _type: 'B-2', label: 'Tourism', value: 'Tourism' },
                { _type: 'B-2', label: 'Vacation (holiday)', value: 'Vacation' },
                { _type: 'B-2', label: 'Visit with friends or relatives', value: 'Visit' },
                { _type: 'B-2', label: 'Medical treatment', value: 'MedicalTreatment' },
                { _type: 'B-2', label: 'Join social events', value: 'JoinSocialevent' },
                { _type: 'B-2', label: 'Participate in amateur events or contests', value: 'Participate' },
                { _type: 'B-2', label: 'Enroll in a short recreational course of study, not for credit toward a degree', value: 'ShortStudy' },
                // Others
                { _type: 'Others', label: 'Study', value: 'Study' },
                { _type: 'Others', label: 'Employment', value: 'Employment' },
                { _type: 'Others', label: 'Professional Performance before a paying audience', value: 'ProfessionalPerformance' },
                { _type: 'Others', label: 'Arrival as a crewmember', value: 'ArrivalCrewmember' },
            ],
            nested: [
                {
                    when: 'AttendConvention',
                    $formkit: 'select',
                    id: 'conventionType',
                    label: 'Type of Convention',
                    options: [
                        { label: 'Scientific', value: 'Scientific' },
                        { label: 'Educational', value: 'Educational' },
                        { label: 'Professional', value: 'Professional' },
                        { label: 'Business', value: 'Business' },
                    ],
                },
                {
                    when: 'JoinSocialevent',
                    $formkit: 'select',
                    id: 'socialEventType',
                    label: 'Type of Social Event',
                    options: [
                        { label: 'Fraternal', value: 'Fraternal' },
                        { label: 'Social', value: 'Social' },
                    ]
                },
                {
                    when: 'ArrivalCrewmember',
                    $formkit: 'select',
                    id: 'crewmemberType',
                    label: 'Type of Crewmember',
                    options: [
                        { label: 'ship', value: 'ship' },
                        { label: 'aircraft', value: 'aircraft' },
                    ]
                },
            ]
        },
        {
            $formkit: 'select',
            id: 'sex',
            name: 'sex',
            label: 'Specify your sex',
            options: [
                { label: 'Select', value: '', attrs: { disabled: true } },
                { label: 'Male', value: 'male', action: true },
                { label: 'Female', value: 'female', action: true },
            ],
            nested: [
                {
                    when: 'female',
                    $formkit: 'select',
                    id: 'pregnancy',
                    label: 'Are you pregnant?',
                    validation: 'required',
                    options: [
                        { label: 'No', value: 'no', action: true },
                        { label: 'Yes', value: 'yes', action: false },
                    ],

                    nested: [
                        {

                            when: 'yes',
                            $formkit: 'select',
                            id: 'nearingPregnancy',
                            validation: "required|is:no",
                            validationVisibility: 'live',
                            validationMessages: {
                                is: 'You will not be allowed due to the possibility of Birth Tourism'
                            },
                            label: 'Are you nearing the end of your pregnancy?',
                            options: [
                                { label: 'No', value: 'no'},
                                { label: 'Yes', value: 'yes' },
                            ]
                        }
                    ]
                }
            ]
        },
        {
            $formkit: 'select',
            id: 'passport',
            label: 'Do you have a passport',
            validation: 'required|is:yes',
            validationVisibility: 'live',
            validationMessages: {
                is: 'You need a passport to travel'
            },
            options: [
                { label: 'No', value: 'no' },
                { label: 'Yes', value: 'yes' },
            ],
            nested: [
                {
                    when: 'yes',
                    $formkit: 'date',
                    id: 'plannedEndDate',
                    label: 'What date will your trip end?',
                    validation: `required|date_after:${new Date()}`,
                    validationVisibility: 'live',
                },
                {
                    when: 'yes',
                    $formkit: 'date',
                    id: 'passportExpiration',
                    validationVisibility: 'live',
                    label: 'Passport expiration date',
                    validation:"required|afterInputDate:plannedEndDate,6",
                }

            ]
        },
        {
        $formkit: 'group',
        id:"visaAttempts",
            children: [
                {
                    // input number for failed visa attempts
                    $formkit: 'number',
                    id: 'failed',
                    name: 'failed',
                    label: 'How many times have you failed to get a VISA?',
                    min:0,
                    value:0,
                },
                // successful visa attempts
                {
                    // input number for successful visa attempts
                    $formkit: 'number',
                    id: 'success',
                    name: 'success',
                    label: 'How many times have you successfully gotten a VISA?',
                    min:0,
                    value:0,
                },
            ]
        },
      
    ]
})
