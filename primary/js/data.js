/* स्थानीय तह प्राइमरी डेमो : काल्पनिक डेटा (Fictional demo data) */
var DEMO = {
  party: "नमुना प्रजातान्त्रिक पार्टी",
  partyEn: "Sample Democratic Party",
  municipality: "नमुना नगरपालिका",
  municipalityEn: "Sample Municipality",
  committeeCode: "SAMITI-2083",
  voters: [
    { code: "DEMO-001", name: "दिलबहादुर राई", ward: 3 },
    { code: "DEMO-002", name: "शान्ता अधिकारी", ward: 1 },
    { code: "DEMO-003", name: "मोहन परियार", ward: 5 }
  ],
  races: [
    {
      id: "mayor", title: "नगर प्रमुख", titleEn: "Mayor", seats: 1,
      note: "नगरपालिकाको प्रमुख पदका लागि पार्टीको उम्मेदवार छनोट",
      candidates: [
        { id: "mayor-1", name: "रामबहादुर थापा" },
        { id: "mayor-2", name: "सीता शर्मा" },
        { id: "mayor-3", name: "हरिप्रसाद अधिकारी" },
        { id: "mayor-4", name: "मीना गुरुङ" }
      ]
    },
    {
      id: "deputy", title: "उपप्रमुख", titleEn: "Deputy Mayor", seats: 1,
      note: "नगरपालिकाको उपप्रमुख पदका लागि पार्टीको उम्मेदवार छनोट",
      candidates: [
        { id: "deputy-1", name: "गोपाल श्रेष्ठ" },
        { id: "deputy-2", name: "लक्ष्मी पौडेल" },
        { id: "deputy-3", name: "दीपक राई" }
      ]
    },
    {
      id: "ward1", title: "वडा नं. १ अध्यक्ष", titleEn: "Ward 1 Chair", seats: 1,
      note: "वडा नं. १ को अध्यक्ष पदका लागि पार्टीको उम्मेदवार छनोट",
      candidates: [
        { id: "ward1-1", name: "कृष्णबहादुर महर्जन" },
        { id: "ward1-2", name: "सरिता तामाङ" }
      ]
    },
    {
      id: "w1-open", title: "वडा नं. १ सदस्य : खुला (२ सिट)", titleEn: "Ward 1 Member: Open (2 seats)", seats: 2,
      note: "वडाका ४ सदस्यमध्ये २ खुला सिटका लागि उम्मेदवार छनोट",
      candidates: [
        { id: "w1-open-1", name: "टेकबहादुर राना" },
        { id: "w1-open-2", name: "श्यामकृष्ण श्रेष्ठ" },
        { id: "w1-open-3", name: "रामप्रसाद न्यौपाने" }
      ]
    },
    {
      id: "w1-women", title: "वडा नं. १ सदस्य : महिला (१ सिट)", titleEn: "Ward 1 Member: Women (1 seat)", seats: 1,
      note: "कोटा सिट : महिला सदस्यका लागि उम्मेदवार छनोट",
      candidates: [
        { id: "w1-women-1", name: "निर्मला अधिकारी" },
        { id: "w1-women-2", name: "तारादेवी श्रेष्ठ" }
      ]
    },
    {
      id: "w1-dalit", title: "वडा नं. १ सदस्य : दलित महिला (१ सिट)", titleEn: "Ward 1 Member: Dalit Women (1 seat)", seats: 1,
      note: "कोटा सिट : दलित महिला सदस्य (अनिवार्य) का लागि उम्मेदवार छनोट",
      candidates: [
        { id: "w1-dalit-1", name: "सुशीला परियार" },
        { id: "w1-dalit-2", name: "जानकी विक" }
      ]
    },
    {
      id: "ward2", title: "वडा नं. २ अध्यक्ष", titleEn: "Ward 2 Chair", seats: 1,
      note: "वडा नं. २ को अध्यक्ष पदका लागि पार्टीको उम्मेदवार छनोट",
      candidates: [
        { id: "ward2-1", name: "अर्जुन केसी" },
        { id: "ward2-2", name: "पार्वती विष्ट" }
      ]
    },
    {
      id: "w2-open", title: "वडा नं. २ सदस्य : खुला (२ सिट)", titleEn: "Ward 2 Member: Open (2 seats)", seats: 2,
      note: "वडाका ४ सदस्यमध्ये २ खुला सिटका लागि उम्मेदवार छनोट",
      candidates: [
        { id: "w2-open-1", name: "भक्तबहादुर कार्की" },
        { id: "w2-open-2", name: "नवराज पौडेल" },
        { id: "w2-open-3", name: "इन्द्रबहादुर तामाङ" }
      ]
    },
    {
      id: "w2-women", title: "वडा नं. २ सदस्य : महिला (१ सिट)", titleEn: "Ward 2 Member: Women (1 seat)", seats: 1,
      note: "कोटा सिट : महिला सदस्यका लागि उम्मेदवार छनोट",
      candidates: [
        { id: "w2-women-1", name: "गीता राई" },
        { id: "w2-women-2", name: "कमला खड्का" }
      ]
    },
    {
      id: "w2-dalit", title: "वडा नं. २ सदस्य : दलित महिला (१ सिट)", titleEn: "Ward 2 Member: Dalit Women (1 seat)", seats: 1,
      note: "कोटा सिट : दलित महिला सदस्य (अनिवार्य) का लागि उम्मेदवार छनोट",
      candidates: [
        { id: "w2-dalit-1", name: "मीना दमाई" },
        { id: "w2-dalit-2", name: "राधा सार्की" }
      ]
    },
    {
      id: "ward3", title: "वडा नं. ३ अध्यक्ष", titleEn: "Ward 3 Chair", seats: 1,
      note: "वडा नं. ३ को अध्यक्ष पदका लागि पार्टीको उम्मेदवार छनोट",
      candidates: [
        { id: "ward3-1", name: "सुरेश यादव" },
        { id: "ward3-2", name: "कमला साह" }
      ]
    },
    {
      id: "w3-open", title: "वडा नं. ३ सदस्य : खुला (२ सिट)", titleEn: "Ward 3 Member: Open (2 seats)", seats: 2,
      note: "वडाका ४ सदस्यमध्ये २ खुला सिटका लागि उम्मेदवार छनोट",
      candidates: [
        { id: "w3-open-1", name: "दलबहादुर विष्ट" },
        { id: "w3-open-2", name: "प्रेमप्रसाद शर्मा" },
        { id: "w3-open-3", name: "कर्णबहादुर मगर" }
      ]
    },
    {
      id: "w3-women", title: "वडा नं. ३ सदस्य : महिला (१ सिट)", titleEn: "Ward 3 Member: Women (1 seat)", seats: 1,
      note: "कोटा सिट : महिला सदस्यका लागि उम्मेदवार छनोट",
      candidates: [
        { id: "w3-women-1", name: "सीताकुमारी यादव" },
        { id: "w3-women-2", name: "पार्वती चौधरी" }
      ]
    },
    {
      id: "w3-dalit", title: "वडा नं. ३ सदस्य : दलित महिला (१ सिट)", titleEn: "Ward 3 Member: Dalit Women (1 seat)", seats: 1,
      note: "कोटा सिट : दलित महिला सदस्य (अनिवार्य) का लागि उम्मेदवार छनोट",
      candidates: [
        { id: "w3-dalit-1", name: "लक्ष्मी कामी" },
        { id: "w3-dalit-2", name: "सरस्वती सुनार" }
      ]
    },
    {
      id: "ward4", title: "वडा नं. ४ अध्यक्ष", titleEn: "Ward 4 Chair", seats: 1,
      note: "वडा नं. ४ को अध्यक्ष पदका लागि पार्टीको उम्मेदवार छनोट",
      candidates: [
        { id: "ward4-1", name: "बीरबहादुर लिम्बू" },
        { id: "ward4-2", name: "राधा कार्की" }
      ]
    },
    {
      id: "w4-open", title: "वडा नं. ४ सदस्य : खुला (२ सिट)", titleEn: "Ward 4 Member: Open (2 seats)", seats: 2,
      note: "वडाका ४ सदस्यमध्ये २ खुला सिटका लागि उम्मेदवार छनोट",
      candidates: [
        { id: "w4-open-1", name: "गणेशबहादुर थापा" },
        { id: "w4-open-2", name: "विष्णुप्रसाद अधिकारी" },
        { id: "w4-open-3", name: "हरिबहादुर गुरुङ" }
      ]
    },
    {
      id: "w4-women", title: "वडा नं. ४ सदस्य : महिला (१ सिट)", titleEn: "Ward 4 Member: Women (1 seat)", seats: 1,
      note: "कोटा सिट : महिला सदस्यका लागि उम्मेदवार छनोट",
      candidates: [
        { id: "w4-women-1", name: "दुर्गा लिम्बू" },
        { id: "w4-women-2", name: "माया तामाङ" }
      ]
    },
    {
      id: "w4-dalit", title: "वडा नं. ४ सदस्य : दलित महिला (१ सिट)", titleEn: "Ward 4 Member: Dalit Women (1 seat)", seats: 1,
      note: "कोटा सिट : दलित महिला सदस्य (अनिवार्य) का लागि उम्मेदवार छनोट",
      candidates: [
        { id: "w4-dalit-1", name: "फूलमाया परियार" },
        { id: "w4-dalit-2", name: "विष्णुमाया विक" }
      ]
    },
    {
      id: "ward5", title: "वडा नं. ५ अध्यक्ष", titleEn: "Ward 5 Chair", seats: 1,
      note: "वडा नं. ५ को अध्यक्ष पदका लागि पार्टीको उम्मेदवार छनोट",
      candidates: [
        { id: "ward5-1", name: "प्रकाश चौधरी" },
        { id: "ward5-2", name: "गीता थारू" }
      ]
    },
    {
      id: "w5-open", title: "वडा नं. ५ सदस्य : खुला (२ सिट)", titleEn: "Ward 5 Member: Open (2 seats)", seats: 2,
      note: "वडाका ४ सदस्यमध्ये २ खुला सिटका लागि उम्मेदवार छनोट",
      candidates: [
        { id: "w5-open-1", name: "केशवप्रसाद पाण्डे" },
        { id: "w5-open-2", name: "राजेन्द्र केसी" },
        { id: "w5-open-3", name: "सन्तोष राई" }
      ]
    },
    {
      id: "w5-women", title: "वडा नं. ५ सदस्य : महिला (१ सिट)", titleEn: "Ward 5 Member: Women (1 seat)", seats: 1,
      note: "कोटा सिट : महिला सदस्यका लागि उम्मेदवार छनोट",
      candidates: [
        { id: "w5-women-1", name: "बिन्दु श्रेष्ठ" },
        { id: "w5-women-2", name: "शान्ता महर्जन" }
      ]
    },
    {
      id: "w5-dalit", title: "वडा नं. ५ सदस्य : दलित महिला (१ सिट)", titleEn: "Ward 5 Member: Dalit Women (1 seat)", seats: 1,
      note: "कोटा सिट : दलित महिला सदस्य (अनिवार्य) का लागि उम्मेदवार छनोट",
      candidates: [
        { id: "w5-dalit-1", name: "गौरी दमाई" },
        { id: "w5-dalit-2", name: "तिलमाया सार्की" }
      ]
    }
  ]
};
