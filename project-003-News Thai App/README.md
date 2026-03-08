# News Thai App

เว็บข่าวไทย สไตล์โมเดิร์น – ข่าวเด่น ฮีโร่ + กริดข่าวล่าสุด แยกตามหมวด

## ฟีเจอร์

- **หน้าแรกสวย โมเดิร์น** – ธีมเข้ม (dark) ฟอนต์ Bai Jamjuree + IBM Plex Sans
- **Hero ข่าวเด่น** – แสดงข่าวแรกเป็นหัวข้อใหญ่
- **กริดข่าวล่าสุด** – การ์ดรูป + หัวข้อ + แหล่งที่มา + วันที่
- **หมวดหมู่** – ทั้งหมด, ทั่วไป, ธุรกิจ, เทคโนโลยี, กีฬา
- **Responsive** – เมนูแฮมเบอร์เกอร์บนมือถือ

## โครงสร้าง

```
project-003-News Thai App/
├── index.html
├── styles/style.css
├── scripts/app.js
├── scripts/api.js
├── scripts/data.js
├── project.yaml
└── README.md
```

## วิธีรัน

เปิด `index.html` ในเบราว์เซอร์ หรือใช้ local server:

```bash
npx serve .
# หรือ
python -m http.server 8080
```

## ข่าวจริงจาก NewsAPI

1. สมัคร API key ฟรีที่ [newsapi.org/register](https://newsapi.org/register)
2. เปิด `scripts/config.js` แล้วใส่ key: `window.NEWS_API_KEY = "your_key_here";`
3. เปิดเว็บใหม่ จะดึงข่าวไทย (country=th) ตามหมวดจาก NewsAPI  
ถ้าไม่ใส่ key หรือ API ผิดพลาด แอปจะใช้ข้อมูลตัวอย่างใน `scripts/data.js` ให้เอง

## ดูเนื้อข่าว

คลิกการ์ดข่าวจะเปิด **Modal** แสดงหัวข้อ, รูป, คำอธิบาย, เนื้อหา (ถ้ามี) และปุ่ม **อ่านต่อที่แหล่งข่าว** ไปยังลิงก์ต้นทาง
