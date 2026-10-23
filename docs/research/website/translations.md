# Form translations for review

The homepage mock (`claim.html`) shows one form in six scripts. The English is final; the other five are drafts and need a native reader. Write a correction in the last column, or leave it empty if the draft is right. Keep the tone plain and polite, the way a public service would write it.

The strings live in `LANGS` in `build-claim.mjs`. After a correction lands there, rebuild the page and the fonts (see `fonts/README.md`), because each font holds only the letters the page shows.

Questions for every reviewer:

- Is the form polite but not stiff?
- Do the two error messages say what to do, not what went wrong?
- Does the language name in the script picker read right?

## Hindi (hi)

Language name in the picker: हिन्दी. Direction: left to right.

| Where | English | Draft | Correction |
|---|---|---|---|
| Field label | Full name | पूरा नाम |  |
| Hint under the field | As it appears on your ID | जैसा आपके पहचान पत्र पर लिखा है |  |
| Error when the name is empty | Enter your full name | अपना पूरा नाम लिखें |  |
| Select label | Contact by | संपर्क का तरीका |  |
| Empty first option | Choose one | एक चुनें |  |
| Option | Email | ईमेल |  |
| Option | Phone | फ़ोन |  |
| Error when no option is chosen | Choose how we should contact you | चुनें कि हम आपसे कैसे संपर्क करें |  |
| Checkbox label | Send me updates | मुझे अपडेट भेजें |  |
| Button | Continue | आगे बढ़ें |  |
| Message after sending | Sent. Check your inbox. | भेज दिया गया। अपना इनबॉक्स देखें। |  |

## Tamil (ta)

Language name in the picker: தமிழ். Direction: left to right.

| Where | English | Draft | Correction |
|---|---|---|---|
| Field label | Full name | முழுப் பெயர் |  |
| Hint under the field | As it appears on your ID | உங்கள் அடையாள அட்டையில் உள்ளபடி |  |
| Error when the name is empty | Enter your full name | உங்கள் முழுப் பெயரை உள்ளிடவும் |  |
| Select label | Contact by | தொடர்பு முறை |  |
| Empty first option | Choose one | ஒன்றைத் தேர்வு செய்யவும் |  |
| Option | Email | மின்னஞ்சல் |  |
| Option | Phone | தொலைபேசி |  |
| Error when no option is chosen | Choose how we should contact you | உங்களை எப்படித் தொடர்பு கொள்வது எனத் தேர்வு செய்யவும் |  |
| Checkbox label | Send me updates | எனக்குப் புதுப்பிப்புகளை அனுப்பவும் |  |
| Button | Continue | தொடரவும் |  |
| Message after sending | Sent. Check your inbox. | அனுப்பப்பட்டது. உங்கள் இன்பாக்ஸைப் பார்க்கவும். |  |

## Arabic (ar)

Language name in the picker: العربية. Direction: right to left.

| Where | English | Draft | Correction |
|---|---|---|---|
| Field label | Full name | الاسم الكامل |  |
| Hint under the field | As it appears on your ID | كما يظهر في بطاقة هويتك |  |
| Error when the name is empty | Enter your full name | أدخل اسمك الكامل |  |
| Select label | Contact by | طريقة التواصل |  |
| Empty first option | Choose one | اختر واحدة |  |
| Option | Email | البريد الإلكتروني |  |
| Option | Phone | الهاتف |  |
| Error when no option is chosen | Choose how we should contact you | اختر طريقة التواصل معك |  |
| Checkbox label | Send me updates | أرسل لي التحديثات |  |
| Button | Continue | متابعة |  |
| Message after sending | Sent. Check your inbox. | تم الإرسال. تحقق من بريدك الوارد. |  |

## Thai (th)

Language name in the picker: ไทย. Direction: left to right.

| Where | English | Draft | Correction |
|---|---|---|---|
| Field label | Full name | ชื่อ-นามสกุล |  |
| Hint under the field | As it appears on your ID | ตามที่ปรากฏบนบัตรประจำตัว |  |
| Error when the name is empty | Enter your full name | กรอกชื่อ-นามสกุลของคุณ |  |
| Select label | Contact by | ช่องทางติดต่อ |  |
| Empty first option | Choose one | เลือกหนึ่งรายการ |  |
| Option | Email | อีเมล |  |
| Option | Phone | โทรศัพท์ |  |
| Error when no option is chosen | Choose how we should contact you | เลือกช่องทางที่ให้เราติดต่อคุณ |  |
| Checkbox label | Send me updates | ส่งข่าวสารให้ฉัน |  |
| Button | Continue | ดำเนินการต่อ |  |
| Message after sending | Sent. Check your inbox. | ส่งแล้ว โปรดตรวจสอบกล่องจดหมายของคุณ |  |

## Japanese (ja)

Language name in the picker: 日本語. Direction: left to right.

| Where | English | Draft | Correction |
|---|---|---|---|
| Field label | Full name | 氏名 |  |
| Hint under the field | As it appears on your ID | 身分証明書の記載どおりに |  |
| Error when the name is empty | Enter your full name | 氏名を入力してください |  |
| Select label | Contact by | 連絡方法 |  |
| Empty first option | Choose one | 選択してください |  |
| Option | Email | メール |  |
| Option | Phone | 電話 |  |
| Error when no option is chosen | Choose how we should contact you | 連絡方法を選択してください |  |
| Checkbox label | Send me updates | 最新情報を受け取る |  |
| Button | Continue | 次へ |  |
| Message after sending | Sent. Check your inbox. | 送信しました。受信トレイを確認してください。 |  |

## Reviewed by

| Language | Reviewer | Date |
|---|---|---|
| Hindi |  |  |
| Tamil |  |  |
| Arabic |  |  |
| Thai |  |  |
| Japanese |  |  |
