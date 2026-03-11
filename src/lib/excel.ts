import ExcelJS from 'exceljs';

type FeedbackRow = {
  index: number;
  category: string;
  keyword: string;
  content: string;
  author?: string;
  created_at: string;
};

// 피드백 엑셀 워크북 생성
export async function createFeedbackWorkbook(
  rows: FeedbackRow[],
  options: { includeAuthor: boolean },
): Promise<ExcelJS.Workbook> {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('피드백');

  // 열 정의
  const columns: Partial<ExcelJS.Column>[] = [
    { header: '번호', key: 'index', width: 8 },
    { header: '카테고리', key: 'category', width: 12 },
    { header: '키워드', key: 'keyword', width: 15 },
    { header: '내용', key: 'content', width: 60 },
  ];

  if (options.includeAuthor) {
    columns.push({ header: '작성자', key: 'author', width: 15 });
  }

  columns.push({ header: '작성일', key: 'created_at', width: 20 });

  sheet.columns = columns;

  // 헤더 스타일
  sheet.getRow(1).font = { bold: true };
  sheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'F2F2F2' },
  };

  // 데이터 추가 (열 key 기반으로 매핑되므로 그대로 전달)
  for (const row of rows) {
    sheet.addRow(row);
  }

  return workbook;
}
