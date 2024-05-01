import { Asset } from "../inference"
import { useData } from "../utils/schema"

type Assets = {label:string, value:Asset['type'] | ''} & Record<string, any>
export const assetTypeSchema:Assets[] = [
    {
        label: 'Select Asset Type',
        value: '',
        selected:true,
        attrs: {
            disabled:true,
        }
    },
    {
        label: 'Property',
        value: 'property'
    },
    {
        label: 'Real Estate',
        value: 'real estate'
    },
    {
        label: 'Cars',
        value: 'cars'
    },
    {
        label: 'Motorbicycles',
        value: 'motorbicycles'
    },
    {
        label: 'Savings',
        value: 'savings'
    },
    {
        label: 'Business',
        value: 'business'
    },
    {
        label: 'Jewelry',
        value: 'jewelry'
    },
    {
        label: 'Collectibles',
        value: 'collectibles'
    },
    {
        label: 'Life Insurance',
        value: 'life insurance'
    },
    {
        label: 'Other',
        value: 'other'
    }
]

export const strongTies = useData({
    id: 'ties',
    $formkit: 'group',
    name: 'ties',
    nested: [
        {
            $formkit: 'number',
            id: 'annualSalaryDollars',
            name: 'annualSalaryDollars',
            label: 'Annual Salary($)',
            validation: 'required',
            validationVisibility: 'live',
            value:0,
        },
        {
            $formkit: 'select',
            id: 'married',
            name: 'married',
            label: 'Are you married?',
            vBind: {
            },
            options: [
                { label: 'No', value: 'no' },
                { label: 'Yes', value: 'yes' },
            ],
            nested: [
                {
                    when: 'yes',
                    $formkit: 'number',
                    id: 'children',
                    name: 'children',
                    label: 'How many children',
                }
            ]
        },
        // are you enrolled in school
        {
            $formkit: 'select',
            id: 'schoolEnrollment',
            name: 'schoolEnrollment',
            label: 'Are you enrolled in school?',
            options: [
                { label: 'No', value: 'no' },
                { label: 'Yes', value: 'yes' },
            ],
        },
    ]
})
