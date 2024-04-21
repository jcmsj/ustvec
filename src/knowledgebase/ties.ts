import { useEvaluate, useData } from "../utils/schema"

export const assetTypes = ['property', 'vehicle', 'savings', 'jewelry', 'collectibles', 'life insurance', 'other']
export const assetTypeSchema = [
    {
        label: 'Select Asset Type',
        value: '',
        selected:true,
        attrs: {
            disabled:true,
        }
    },
    {
        'label': 'Property',
    },
    {
        'label': 'Vehicle',
    },
    {
        'label': 'Savings',
    },
    {
        'label': 'Jewelry',
    },
    {
        'label': 'Collectibles',
    },
    {
        'label': 'Life Insurance',
    },
    {
        'label': 'Other',
    },
]

const evaluations = useEvaluate()
export const strongTies = useData({
    id: 'ties',
    $formkit: 'group',
    name: 'ties',
    nested: [
        {
            $formkit: 'number',
            id: 'AnnualSalaryDollars',
            name: 'AnnualSalaryDollars',
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
                    id: 'Children',
                    name: 'Children',
                    label: 'How many children',
                }
            ]
        },
    ]
})
