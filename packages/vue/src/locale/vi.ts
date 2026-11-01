import { defineLocale } from './defineLocale'

/** Tiếng Việt (`vi`). Keys left out fall back to English. */
export const vi = defineLocale({
  name: 'Tiếng Việt',
  code: 'vi',
  messages: {
    alert: {
      close: 'Đóng',
    },
    alertDialog: {
      close: 'Đóng',
    },
    autocomplete: {
      searchPlaceholder: 'Tìm kiếm…',
    },
    breadcrumbs: {
      label: 'đường dẫn điều hướng',
    },
    carousel: {
      dots: 'Chọn slide để hiển thị',
      goto: 'Đi tới ô {slide}',
      next: 'Sau',
      prev: 'Trước',
      roledescription: 'băng chuyền',
      slide: 'slide',
    },
    closeButton: {
      close: 'Đóng',
    },
    codeBlock: {
      copy: 'Sao chép mã vào bộ nhớ tạm',
    },
    comboBox: {
      trigger: 'Hiển thị tùy chọn',
    },
    commandPalette: {
      back: 'Quay lại',
      close: 'Đóng',
      noData: 'Không có dữ liệu',
      placeholder: 'Nhập lệnh hoặc tìm kiếm…',
      results: 'Kết quả',
    },
    dashboardSidebar: {
      close: 'Đóng thanh bên',
    },
    dashboardSidebarCollapse: {
      collapse: 'Thu gọn thanh bên',
      expand: 'Mở rộng thanh bên',
    },
    dashboardSidebarToggle: {
      close: 'Đóng thanh bên',
      open: 'Mở thanh bên',
    },
    drawer: {
      close: 'Đóng',
    },
    dropZone: {
      removeFile: 'Xóa {filename}',
    },
    error: {
      clear: 'Quay lại trang chủ',
    },
    header: {
      close: 'Đóng menu',
      open: 'Mở menu',
    },
    metric: {
      progress: 'tiến trình',
    },
    modal: {
      close: 'Đóng',
    },
    numberField: {
      decrement: 'Giảm',
      increment: 'Tăng',
      roledescription: 'trường số',
    },
    numberStepper: {
      decrement: 'Giảm',
      increment: 'Tăng',
      roledescription: 'trường số',
    },
    pagination: {
      next: 'Trang tiếp theo',
      nextLabel: 'Sau',
      prev: 'Trang trước',
      prevLabel: 'Trước',
    },
    richTable: {
      noData: 'Không có dữ liệu',
    },
    sidebar: {
      close: 'Đóng thanh bên',
      toggle: 'Chuyển đổi',
    },
    spinner: {
      label: 'đang tải',
    },
    toast: {
      close: 'Đóng',
    },
    toc: {
      title: 'Trong trang này',
    },
  },
})
