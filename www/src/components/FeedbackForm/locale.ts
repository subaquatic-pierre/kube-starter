import { I18n } from 'types/config';

export const getFormTranslation = (lang: I18n) => {
  if (lang === 'ar') {
    return {
      heading: 'يرجى إكمال نموذج الملاحظات لتلقي شهادتك',
      sexOptions: ['ذكر', 'أنثى '],
      satisfiedOptions: [
        'راضي تماما',
        'راضي',
        'محايد',
        'غير راضي ',
        'غير راضي مطلقاً',
      ],
      nationOptions: ['اماراتي', 'عربي', 'آسيوي', 'غربي', 'افريقي'],
      ageOptions: ['18 – 29 سنة', '30 – 39 سنة', '40 – 49 سنة', '50 سنة فأكبر'],
      maritalOptions: [
        'لم يتزوج أبداً',
        'متزوج',
        'مطلق',
        'أرمل',
        'منفصل (هجر)',
      ],
      educationOptions: [
        'أمي',
        'يقرأ ويكتب',
        'ابتدائي',
        'إعدادي',
        'ثانوي',
        'فوق الثانوي ودون الجامعي',
        'جامعي',
        'دبلوم فوق الجامعي',
        'ماجستير',
        'دكتوراه',
      ],
      name: 'الإسم',
      nationality: 'الجنسية',
      sex: 'الجنس',
      age: 'الفئة العمرية',
      maritalStatus: 'الحالة الاجتماعية',
      education: 'الحالة التعليمية',
      question1: 'هل المعلومات التي استلمتها قبل المشاركة كانت كافية ؟',
      question2: 'ما هو رضاك عن المؤتمر بشكل عام ؟',
      question3: 'ما مدى رضاك عن أهداف المؤتمر وموضوعاته ؟',
      question4: 'ما مدى رضاك عن التجهيز والإعداد للمؤتمر؟',
      question5:
        'ما مدى رضاك عن فترة انعقاد المؤتمر ( 3 أيام ) هل كانت كافيه ؟',
      question6:
        'ما مدى رضاك عن البرنامج العلمي هل كان متكاملا وغطى جميع المحاور ؟',
      question7:
        'ما مدى رضاك عن المستوى العلمي والخبرة للمتحدثين الرئيسين متوافق مع المحاور المخصصة لكل منهم ؟',
      question8: 'ما مدى رضاك عن قاعة المؤتمر كانت مناسبة ؟',
      question9: 'ما مدى رضاك عن المناقشات خلال الجلسات ؟',
      question10: 'هل الترجمة الفورية كانت جيدة ؟',
      question11: 'ما مدى رضاك عن إكتساب معلومات أو معرفة جديدة بالمؤتمر ؟',
      question12: 'هل شاركت في المناقشات بإحدى الورش العلمية  ؟',
      questionSpeaker: 'هل تسمح لنا بنشر جلستك المسجلة للعامة؟',
      suggestions: 'هل لديك أي ملاحظات أو مقترحات أخرى تود إضافتها ؟',
      submit: 'إرسال',
      yes: 'نعم',
      no: 'لا',
      required: 'الحقل مطلوب',
    };
  } else {
    return {
      heading: 'Please complete the feedback form to receive your certificate',
      sexOptions: ['Male', 'Female '],
      satisfiedOptions: [
        'Very satisfied',
        'Satisfied',
        'Neutral',
        'Dissatisfied',
        'Very Dissatisfied',
      ],
      nationOptions: ['Emirati', 'Arab', 'Asian', 'Westerner', 'African'],
      ageOptions: [
        '18 – 29 years old',
        '30 – 39 years old',
        '40 – 49 years old',
        '50 years old – older',
      ],
      maritalOptions: [
        'Never married',
        'Married',
        'Divorced',
        'Widowed',
        'Separated (abandoned)',
      ],
      educationOptions: [
        'Illiterate',
        'Literate',
        'Primary  school grade',
        'Preparatory school  Grade',
        'Secondary school Grade',
        'Post-Secondary Grade',
        "Bachelor's degree",
        'Post graduate diploma',
        'Master Degree',
        'Ph.D.',
      ],
      name: 'Name',
      nationality: 'Nationality',
      sex: 'Sex',
      age: 'Age',
      maritalStatus: 'Marital Status',
      education: 'Education Status',
      question1:
        'Do you receive a sufficient information prior to your participation?',
      question2: 'Overall, how satisfied are you with the conference?',
      question3:
        'How satisfied are you with the conference’s objectives and topics?',
      question4:
        'How satisfied are you with processing and preparation of the conference?',
      question5:
        'How satisfied are you with the period of the conference (three days), is it enough?',
      question6:
        'How satisfied are you with the scientific program, is it integrated and covers all areas?',
      question7:
        'How satisfied are you with Keynote Speakers’scientific level and expertise, are they compatible with their respective areas?',
      question8:
        'How satisfied are you with Conference hall, is it appropriate?',
      question9:
        'How satisfied are you with the discussions during the sessions?',
      question10:
        'How satisfied are you with the interpretation provided, is it good?',
      question11:
        'How satisfied are you with acquiring new knowledge or information during the conference?',
      question12:
        'Do you participate in the discussions of one of the scientific workshops?',
      questionSpeaker:
        'Do you allow us to publish your recorded session to the public?',
      suggestions: 'Do you have any other comments or suggestions?',
      submit: 'Submit',
      yes: 'Yes',
      no: 'No',

      required: 'Field is required',
    };
  }
};
