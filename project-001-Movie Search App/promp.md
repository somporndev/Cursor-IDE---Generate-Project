
สร้างเว็บแอป "Movie Search App" ตามรายละเอียดนี้

## ข้อกำหนดโปรเจกต์ (project spec)
- **Stack:** HTML5, CSS3, Vanilla JavaScript เท่านั้น (ไม่ใช้ framework)
- **API:** OMDb API (https://www.omdbapi.com/) — ใช้พารามิเตอร์ s สำหรับค้นหาชื่อ, i สำหรับดึงรายละเอียดด้วย imdbID
- **API Key:** ให้รับจาก config (เช่น ในไฟล์ config หรือตัวแปรใน scripts/api.js) และใส่ใน README ว่าต้องไปสมัครที่ https://www.omdbapi.com/apikey.aspx

## ฟีเจอร์ที่ต้องมี
1. **ค้นหาภาพยนตร์** — มีช่องค้นหา (แสดงเมื่อกดไอคอนแว่นขยาย) พิมพ์ชื่อแล้วเรียก OMDb แสดงผล มี debounce ประมาณ 300ms
2. **แสดงผลการค้นหา** — การ์ดโปสเตอร์ แสดง Poster, ชื่อ, ปี, เรตติ้ง (IMDb) ถ้ามี
3. **หน้ารายละเอียด** — คลิกการ์ดแล้วเรียก API ด้วย imdbID แสดงใน modal: Plot, Director, Actors, Runtime, Language, IMDb rating
4. **สถานะโหลดและข้อผิดพลาด** — Loading ตอนค้นหา/โหลดรายละเอียด, ข้อความเมื่อไม่พบผลหรือ API error

## UI (อ้างอิงจาก ref ธีมมืด สไตล์ streaming — ดูรายละเอียดใน sections 1–8 ด้านบน)
- **แถบนำทางบน:** ซ้าย = DASHBOARD, MOVIES, SERIES, KIDS (ลิงก์/แท็บ มีสถานะ active) | ขวา = ไอคอน Search, ไอคอน Profile (วงกลม)
- **Hero (Featured):** พื้นหลังเป็นภาพเต็มจากเรื่อง featured, ข้อความซ้อนบน: ชื่อเรื่องใหญ่สีขาว, บรรทัดรอง (เช่น "A Disney Original Film · 98% Match 2021" โดย 98% Match ใช้สีเขียว/เหลือง), ปุ่ม PLAY (พื้นหลังม่วง rounded), ปุ่ม Add to list (วงกลมขอบขาวมี +)
- **My List:** หัวข้อ "MY LIST" สีขาวหนา, ด้านล่างเป็นแถวโปสเตอร์ภาพยนตร์เลื่อนแนวนอนได้ แต่ละการ์ดมีขอบหรือ glow สีขาวอ่อน, aspect ratio โปสเตอร์แนวตั้ง (2:3)
- **Search:** กดไอคอน Search แล้วแสดง overlay เต็มจอใต้ nav มีช่อง input และพื้นที่แสดงผลการค้นหา (การ์ดแบบเดียวกัน)
- **Modal รายละเอียด:** พื้นหลังมืด ตัวอักษรขาว accent ม่วง ปุ่มปิด (×)
- **สไตล์รวม:** พื้นหลังโทนมืด (ดำ/เทาเข้ม), ตัวอักษรสีขาว sans-serif, สี accent ม่วง, responsive

## โครงสร้างไฟล์ที่ต้องสร้าง
- index.html (โครง nav, hero, search overlay, list section, modal)
- styles/style.css (ตัวแปร CSS สำหรับสี/ระยะ, layout, component)
- scripts/api.js (ฟังก์ชันเรียก OMDb: search(query), getById(id))
- scripts/ui.js (สร้างการ์ด, ตั้งค่า hero, แสดง/ซ่อน modal, loading/error)
- scripts/app.js (init, event: เปิด/ปิด search, ค้นหา debounce, คลิกการ์ดเปิด modal, ปุ่ม PLAY/Add ถ้าต้องการ)
- README.md (วิธีรัน เช่น python -m http.server 8080, วิธีใส่ API key)

สร้างโค้ดให้ครบและรันได้ โดยปฏิบัติตาม project.yaml และ ui-spec ของโปรเจกต์นี้



อ้างอิง spec จาก  @project-001-Movie Search App/ui-spec.md ในโฟลเดอร์นี้

