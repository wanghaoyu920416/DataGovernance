import { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun, AlignmentType, WidthType } from 'docx';
import { Question } from './questionGenerator';

export interface ExportOptions {
  title: string;
  questions: Question[];
  withAnswer: boolean;
  type: 'oral' | 'vertical';
}

const createTextRun = (text: string, bold = false, size = 28) => {
  return new TextRun({ text, bold, size });
};

const createParagraph = (text: string) => {
  return new Paragraph({
    children: [createTextRun(text)],
    alignment: AlignmentType.LEFT,
    spacing: { line: 480 },
  });
};

const createQuestionTable = (questions: Question[], startIndex: number, endIndex: number) => {
  const rows: TableRow[] = [];
  const colCount = 4;
  const rowCount = Math.ceil((endIndex - startIndex) / colCount);

  for (let row = 0; row < rowCount; row++) {
    const cells = [];
    for (let col = 0; col < colCount; col++) {
      const idx = startIndex + row * colCount + col;
      if (idx < endIndex && idx < questions.length) {
        const q = questions[idx];
        cells.push(
          new TableCell({
            children: [
              new Paragraph({
                children: [createTextRun(`${idx + 1}. ${q.content}`, false, 28)],
                spacing: { line: 360 },
              }),
            ],
            width: { size: 25, type: WidthType.PERCENTAGE },
          })
        );
      } else {
        cells.push(
          new TableCell({
            children: [new Paragraph({ children: [] })],
            width: { size: 25, type: WidthType.PERCENTAGE },
          })
        );
      }
    }
    rows.push(new TableRow({ children: cells }));
  }

  return new Table({
    rows,
    width: { size: 100, type: WidthType.PERCENTAGE },
  });
};

const createAnswerTable = (questions: Question[], startIndex: number, endIndex: number) => {
  const rows: TableRow[] = [];
  const colCount = 4;
  const rowCount = Math.ceil((endIndex - startIndex) / colCount);

  for (let row = 0; row < rowCount; row++) {
    const cells = [];
    for (let col = 0; col < colCount; col++) {
      const idx = startIndex + row * colCount + col;
      if (idx < endIndex && idx < questions.length) {
        const q = questions[idx];
        cells.push(
          new TableCell({
            children: [
              new Paragraph({
                children: [createTextRun(`${idx + 1}. ${q.content}${q.answer}`, false, 28)],
                spacing: { line: 360 },
              }),
            ],
            width: { size: 25, type: WidthType.PERCENTAGE },
          })
        );
      } else {
        cells.push(
          new TableCell({
            children: [new Paragraph({ children: [] })],
            width: { size: 25, type: WidthType.PERCENTAGE },
          })
        );
      }
    }
    rows.push(new TableRow({ children: cells }));
  }

  return new Table({
    rows,
    width: { size: 100, type: WidthType.PERCENTAGE },
  });
};

export const exportToWord = async (options: ExportOptions): Promise<Blob> => {
  const { title, questions, withAnswer, type } = options;

  if (type === 'oral') {
    const questionsPerPage = 32;
    const pages: Paragraph[][] = [];
    let currentPage: Paragraph[] = [];
    const totalQuestions = questions.length;

    for (let i = 0; i < totalQuestions; i++) {
      if (i % questionsPerPage === 0 && i > 0) {
        pages.push(currentPage);
        currentPage = [];
      }
      currentPage.push(
        new Paragraph({
          children: [createTextRun(`${i + 1}. ${questions[i].content}`, false, 28)],
          spacing: { line: 400 },
        })
      );
    }
    if (currentPage.length > 0) {
      pages.push(currentPage);
    }

    const children: (Paragraph | Table)[] = [];

    children.push(
      new Paragraph({
        children: [new TextRun({ text: title, bold: true, size: 36 })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
      })
    );

    children.push(
      new Paragraph({
        children: [new TextRun({ text: '姓名:_______________  日期:_______________  用时:_______分_______秒', size: 24 })],
        alignment: AlignmentType.LEFT,
        spacing: { after: 300 },
      })
    );

    for (let pageIdx = 0; pageIdx < pages.length; pageIdx++) {
      if (pageIdx > 0) {
        children.push(
          new Paragraph({
            children: [],
            pageBreakBefore: true,
          })
        );
      }

      const start = pageIdx * questionsPerPage;
      const end = Math.min(start + questionsPerPage, totalQuestions);
      children.push(createQuestionTable(questions, start, end));
    }

    if (withAnswer) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: '===== 参考答案 =====', bold: true, size: 32 })],
          alignment: AlignmentType.CENTER,
          spacing: { before: 600, after: 400 },
          pageBreakBefore: true,
        })
      );

      for (let pageIdx = 0; pageIdx < pages.length; pageIdx++) {
        if (pageIdx > 0) {
          children.push(
            new Paragraph({
              children: [],
              pageBreakBefore: true,
            })
          );
        }

        const start = pageIdx * questionsPerPage;
        const end = Math.min(start + questionsPerPage, totalQuestions);
        children.push(createAnswerTable(questions, start, end));
      }
    }

    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              size: {
                width: 11906,
                height: 16838,
              },
              margin: {
                top: 1134,
                right: 1134,
                bottom: 1134,
                left: 1134,
              },
            },
          },
          children,
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    return blob;
  }

  return new Blob(['Vertical format not implemented'], { type: 'application/docx' });
};

export const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
