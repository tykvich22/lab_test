import { UserLoginResult } from './typings'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'

import PdfPlaceholder from './assets/images/Pdf.jpg'
import PngPlaceholder from './assets/images/Png.jpg'
import JpegPlaceholder from './assets/images/jpeg.jpg'
import ExcelPlaceholder from './assets/images/excel.jpg'
import PptPlaceholder from './assets/images/PPT.jpg'
import WordPlaceholder from './assets/images/word.jpg'
import BmpPlaceholder from './assets/images/bmp.png'
import OthersPlaceholder from './assets/images/others.png'

export function getUserInfo(): UserLoginResult | undefined {
  const user = localStorage.getItem('user')
  if (!user) return
  return JSON.parse(user)
}

export function getRole(): any {
  const role = localStorage.getItem('role')
  if (!role) return
  return role
}

export function printOrDownloadDoc(
  docRef: any,
  print: boolean,
  scale?: number,
) {
  if (!docRef.current) return

  html2canvas(docRef.current || docRef, {
    scale: scale || 5,
    logging: false,
    useCORS: true,
    backgroundColor: null,
  }).then((canvas) => {
    const pdf = new jsPDF({
      format: 'a4',
      unit: 'mm',
      orientation: 'p',
    })

    const imgWidth = 210
    const pageHeight = 295
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight

    let position = 0

    const imgData = canvas.toDataURL()

    // pdf.addPage('a4', 'p')
    pdf.addImage(
      imgData,
      'JPEG',
      0,
      position,
      // 208,
      imgWidth,
      imgHeight,
      // (canvas.height / canvas.width) * 208,
      undefined,
      'SLOW',
    )
    heightLeft -= pageHeight

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    print ? pdf.output('dataurlnewwindow') : pdf.save()
  })
}

export const getImagePlaceholderFromMime = (path?: string): string => {
  if (!path) {
    path = ''
  }
  console.log(path)
  if (path.includes('.png')) {
    return PngPlaceholder
  } else if (path.includes('.pdf')) {
    return PdfPlaceholder
  } else if (path.includes('.jpg') || path.includes('.jpeg')) {
    return JpegPlaceholder
  } else if (path.includes('.xl') || path.includes('.csv')) {
    return ExcelPlaceholder
  } else if (path.includes('.doc')) {
    return WordPlaceholder
  } else if (path.includes('.ppt')) {
    return PptPlaceholder
  } else if (path.includes('.bmp')) {
    return BmpPlaceholder
  } else {
    return OthersPlaceholder
  }
}

export const phoneNumber = (phone: string): string =>
  phone[0] == '8' || phone[0] == '+' || phone[0] == '2' || phone == ''
    ? phone
    : `+${phone}`
