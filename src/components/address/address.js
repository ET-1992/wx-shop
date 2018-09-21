import  templateTypeText from 'constants/templateType';

Component({
    properties: {
        address: {
            type: Object,
            value: {},
        },
        defineTypeGlobal: {
            type: String,
            value: ''
        }
    },
    data: {
        templateTypeText
    }
});

