import { defineLocale } from './defineLocale'

/** ไทย (`th`). Keys left out fall back to English. */
export const th = defineLocale({
  name: 'ไทย',
  code: 'th',
  messages: {
    alert: {
      close: 'ปิด',
    },
    alertDialog: {
      close: 'ปิด',
    },
    autocomplete: {
      searchPlaceholder: 'ค้นหา…',
    },
    breadcrumbs: {
      label: 'เส้นทางนำทาง',
    },
    carousel: {
      dots: 'เลือกสไลด์ที่จะแสดง',
      goto: 'ไปที่ {slide}',
      next: 'ถัดไป',
      prev: 'ย้อนกลับ',
      roledescription: 'ภาพหมุนเวียน',
      slide: 'สไลด์',
    },
    closeButton: {
      close: 'ปิด',
    },
    codeBlock: {
      copy: 'คัดลอกโค้ดไปยังคลิปบอร์ด',
    },
    comboBox: {
      trigger: 'แสดงตัวเลือก',
    },
    commandPalette: {
      back: 'ย้อนกลับ',
      close: 'ปิด',
      noData: 'ไม่มีข้อมูล',
      placeholder: 'พิมพ์คำสั่งหรือค้นหา…',
      results: 'ผลลัพธ์',
    },
    dashboardSidebar: {
      close: 'ปิดแถบด้านข้าง',
    },
    dashboardSidebarCollapse: {
      collapse: 'ย่อแถบด้านข้าง',
      expand: 'ขยายแถบด้านข้าง',
    },
    dashboardSidebarToggle: {
      close: 'ปิดแถบด้านข้าง',
      open: 'เปิดแถบด้านข้าง',
    },
    drawer: {
      close: 'ปิด',
    },
    dropZone: {
      removeFile: 'ลบ {filename}',
    },
    error: {
      clear: 'กลับไปยังหน้าหลัก',
    },
    header: {
      close: 'ปิดเมนู',
      open: 'เปิดเมนู',
    },
    metric: {
      progress: 'ความคืบหน้า',
    },
    modal: {
      close: 'ปิด',
    },
    numberField: {
      decrement: 'ลด',
      increment: 'เพิ่ม',
      roledescription: 'ช่องตัวเลข',
    },
    numberStepper: {
      decrement: 'ลด',
      increment: 'เพิ่ม',
      roledescription: 'ช่องตัวเลข',
    },
    pagination: {
      next: 'หน้าต่อไป',
      nextLabel: 'ถัดไป',
      prev: 'หน้าที่แล้ว',
      prevLabel: 'ย้อนกลับ',
    },
    richTable: {
      noData: 'ไม่มีข้อมูล',
    },
    sidebar: {
      close: 'ปิดแถบด้านข้าง',
      toggle: 'สลับ',
    },
    spinner: {
      label: 'กำลังโหลด',
    },
    toast: {
      close: 'ปิด',
    },
    toc: {
      title: 'ในหน้านี้',
    },
  },
})
