# स्थानीय तह प्राइमरी डेमो (Local Primary Demo)

अमेरिकी प्राइमरी (US Primary) बाट प्रेरित, नेपालका स्थानीय तह (नगरपालिका/वडा) का लागि
उम्मेदवार छनोट प्राइमरीको डेमो प्रोटोटाइप। सम्पूर्ण इन्टरफेस नेपालीमा छ, अस्पष्ट
शब्दमा अङ्ग्रेजी अर्थ कोष्ठकमा दिइएको छ।

**यो डेमो हो, आधिकारिक निर्वाचन होइन। सबै नाम र तथ्याङ्क काल्पनिक हुन्।**

## संरचना

- `index.html` : मुख्य पृष्ठ, डेमो नियम, ३ जना काल्पनिक मतदाता साइन-इन
- `guidelines.html` : पूर्ण प्राइमरी निर्देशिका (१४ खण्ड)
- `ballot.html` + `js/ballot.js` : मतपत्र (७ दौड, खोज, अर्को/समीक्षा, दोहोरो पुष्टि, रसिद)
- `results.html` + `js/results.js` : निर्वाचन समिति कोडबाट नतिजा + डेमो रिसेट
- `js/data.js` : काल्पनिक डेटा (पार्टी, नगरपालिका, दौड, उम्मेदवार, मतदाता)
- `css/style.css` : साझा स्टाइल (मोबाइलमैत्री)

डेमो कोडहरू: मतदाता `DEMO-001/002/003`, निर्वाचन समिति `SAMITI-2083`।

## GitHub Pages मा राख्ने तरिका (आफ्नै मेसिनबाट)

```bash
cd ~/workspace/local-primary-demo
# mnepal000.github.io repo भित्र /primary/ फोल्डरमा कपी गर्ने, वा छुट्टै repo बनाउने
cp -r . /path/to/mnepal000.github.io/primary/
cd /path/to/mnepal000.github.io
git add primary && git commit -m "Add local primary demo prototype" && git push
```

त्यसपछि `https://mnepal000.github.io/primary/` मा खुल्छ।
