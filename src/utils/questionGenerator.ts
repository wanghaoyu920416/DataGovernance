export interface Question {
  id: string;
  content: string;
  answer: string;
  type: 'oral' | 'vertical';
}

const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const shuffle = <T>(array: T[]): T[] => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

const generateId = (): string => {
  return Math.random().toString(36).substring(2, 11);
};

export const generators: Record<string, (count: number) => Question[]> = {
  'compare-5': (count) => {
    const questions: Question[] = [];
    const used = new Set<string>();
    while (questions.length < count) {
      const a = randomInt(1, 5);
      const b = randomInt(1, 5);
      const operators = ['>', '<', '='];
      const op = operators[randomInt(0, 2)];
      let correctAnswer: string;
      if (op === '>') correctAnswer = a > b ? '√' : '×';
      else if (op === '<') correctAnswer = a < b ? '√' : '×';
      else correctAnswer = a === b ? '√' : '×';
      const content = `${a}${op}${b}`;
      const key = `${content}-${correctAnswer}`;
      if (!used.has(key) || questions.length >= 3) {
        used.add(key);
        questions.push({ id: generateId(), content, answer: correctAnswer, type: 'oral' });
      }
    }
    return questions;
  },

  'add-5': (count) => {
    const questions: Question[] = [];
    const used = new Set<number>();
    while (questions.length < count) {
      const a = randomInt(1, 4);
      const b = randomInt(1, 5 - a);
      const sum = a + b;
      if (!used.has(sum * 10 + a)) {
        used.add(sum * 10 + a);
        questions.push({ id: generateId(), content: `${a}+${b}=`, answer: String(sum), type: 'oral' });
      }
    }
    return questions;
  },

  'sub-5': (count) => {
    const questions: Question[] = [];
    const used = new Set<number>();
    while (questions.length < count) {
      const result = randomInt(1, 4);
      const b = randomInt(1, 5 - result);
      const a = result + b;
      if (!used.has(a * 10 + b)) {
        used.add(a * 10 + b);
        questions.push({ id: generateId(), content: `${a}-${b}=`, answer: String(result), type: 'oral' });
      }
    }
    return questions;
  },

  'mixed-5': (count) => {
    const half = Math.floor(count / 2);
    const addQuestions = generators['add-5'](half);
    const subQuestions = generators['sub-5'](count - half);
    return shuffle([...addQuestions, ...subQuestions]);
  },

  'zero': (count) => {
    const questions: Question[] = [];
    const templates = [
      (a: number) => ({ content: `${a}-0=`, answer: String(a) }),
      (a: number) => ({ content: `0+${a}=`, answer: String(a) }),
      (a: number) => ({ content: `${a}+0=`, answer: String(a) }),
      (a: number) => ({ content: `0-0=`, answer: '0' }),
    ];
    let idx = 0;
    while (questions.length < count) {
      const template = templates[idx % templates.length];
      const a = randomInt(1, 5);
      const q = template(a);
      questions.push({ id: generateId(), ...q, type: 'oral' });
      idx++;
    }
    return questions;
  },

  'compare-10': (count) => {
    const questions: Question[] = [];
    const used = new Set<string>();
    while (questions.length < count) {
      const a = randomInt(1, 10);
      const b = randomInt(1, 10);
      const operators = ['>', '<', '='];
      const op = operators[randomInt(0, 2)];
      let correctAnswer: string;
      if (op === '>') correctAnswer = a > b ? '√' : '×';
      else if (op === '<') correctAnswer = a < b ? '√' : '×';
      else correctAnswer = a === b ? '√' : '×';
      const content = `${a}${op}${b}`;
      const key = `${content}-${correctAnswer}`;
      if (!used.has(key) || questions.length >= 3) {
        used.add(key);
        questions.push({ id: generateId(), content, answer: correctAnswer, type: 'oral' });
      }
    }
    return questions;
  },

  'add-10': (count) => {
    const questions: Question[] = [];
    const used = new Set<number>();
    while (questions.length < count) {
      const a = randomInt(1, 9);
      const b = randomInt(1, Math.min(9, 10 - a));
      const sum = a + b;
      if (!used.has(sum * 100 + a * 10 + b)) {
        used.add(sum * 100 + a * 10 + b);
        questions.push({ id: generateId(), content: `${a}+${b}=`, answer: String(sum), type: 'oral' });
      }
    }
    return questions;
  },

  'sub-10': (count) => {
    const questions: Question[] = [];
    const used = new Set<number>();
    while (questions.length < count) {
      const result = randomInt(1, 9);
      const b = randomInt(1, Math.min(9, 10 - result));
      const a = result + b;
      if (!used.has(a * 100 + b * 10 + result)) {
        used.add(a * 100 + b * 10 + result);
        questions.push({ id: generateId(), content: `${a}-${b}=`, answer: String(result), type: 'oral' });
      }
    }
    return questions;
  },

  'chain-10': (count) => {
    const questions: Question[] = [];
    while (questions.length < count) {
      const type = randomInt(0, 1);
      if (type === 0) {
        const a = randomInt(1, 3);
        const b = randomInt(1, 3);
        const c = randomInt(1, Math.max(1, 7 - a - b));
        const result = a + b + c;
        questions.push({ id: generateId(), content: `${a}+${b}+${c}=`, answer: String(result), type: 'oral' });
      } else {
        const result = randomInt(1, 3);
        const b = randomInt(1, 4);
        const c = randomInt(1, Math.min(5, 9 - result - b));
        const a = result + b + c;
        questions.push({ id: generateId(), content: `${a}-${b}-${c}=`, answer: String(result), type: 'oral' });
      }
    }
    return questions;
  },

  'mixed-10': (count) => {
    const questions: Question[] = [];
    while (questions.length < count) {
      const type = randomInt(0, 1);
      if (type === 0) {
        const a = randomInt(1, 5);
        const b = randomInt(1, Math.min(5, 9 - a));
        const c = randomInt(1, Math.min(5, a + b));
        const result = a + b - c;
        questions.push({ id: generateId(), content: `${a}+${b}-${c}=`, answer: String(result), type: 'oral' });
      } else {
        const c = randomInt(1, 5);
        const a = randomInt(c + 1, 9);
        const b = randomInt(1, Math.min(5, a - c));
        const result = a - b + c;
        questions.push({ id: generateId(), content: `${a}-${b}+${c}=`, answer: String(result), type: 'oral' });
      }
    }
    return questions;
  },

  'carry-20': (count) => {
    const questions: Question[] = [];
    const used = new Set<number>();
    while (questions.length < count) {
      const pairs = [[9, 9], [9, 8], [9, 7], [9, 6], [8, 9], [8, 8], [8, 7], [7, 9], [7, 8], [6, 9]];
      const [a, b] = pairs[randomInt(0, pairs.length - 1)];
      if (!used.has(a * 10 + b)) {
        used.add(a * 10 + b);
        questions.push({ id: generateId(), content: `${a}+${b}=`, answer: String(a + b), type: 'oral' });
      }
    }
    return questions;
  },

  'sub-9': (count) => {
    const questions: Question[] = [];
    const used = new Set<number>();
    while (questions.length < count) {
      const result = randomInt(1, 9);
      const a = result + 9;
      if (!used.has(a)) {
        used.add(a);
        questions.push({ id: generateId(), content: `${a}-9=`, answer: String(result), type: 'oral' });
      }
    }
    return questions;
  },

  'sub-876': (count) => {
    const questions: Question[] = [];
    const used = new Set<number>();
    while (questions.length < count) {
      const subtractors = [8, 7, 6];
      const b = subtractors[randomInt(0, 2)];
      const result = randomInt(2, 9);
      const a = result + b;
      if (!used.has(a * 10 + b)) {
        used.add(a * 10 + b);
        questions.push({ id: generateId(), content: `${a}-${b}=`, answer: String(result), type: 'oral' });
      }
    }
    return questions;
  },

  'sub-5432': (count) => {
    const questions: Question[] = [];
    const used = new Set<number>();
    while (questions.length < count) {
      const subtractors = [5, 4, 3, 2];
      const b = subtractors[randomInt(0, 3)];
      const result = randomInt(2, 10);
      const a = result + b;
      if (!used.has(a * 10 + b)) {
        used.add(a * 10 + b);
        questions.push({ id: generateId(), content: `${a}-${b}=`, answer: String(result), type: 'oral' });
      }
    }
    return questions;
  },

  'compare-20': (count) => {
    const questions: Question[] = [];
    const used = new Set<string>();
    while (questions.length < count) {
      const a = randomInt(1, 20);
      const b = randomInt(1, 20);
      const operators = ['>', '<', '='];
      const op = operators[randomInt(0, 2)];
      let correctAnswer: string;
      if (op === '>') correctAnswer = a > b ? '√' : '×';
      else if (op === '<') correctAnswer = a < b ? '√' : '×';
      else correctAnswer = a === b ? '√' : '×';
      const content = `${a}${op}${b}`;
      const key = `${content}-${correctAnswer}`;
      if (!used.has(key) || questions.length >= 3) {
        used.add(key);
        questions.push({ id: generateId(), content, answer: correctAnswer, type: 'oral' });
      }
    }
    return questions;
  },

  'add-20': (count) => {
    const pairs = [
      [9, 9], [9, 8], [9, 7], [9, 6], [9, 5],
      [8, 9], [8, 8], [8, 7], [8, 6], [8, 5],
      [7, 9], [7, 8], [7, 7], [7, 6],
      [6, 9], [6, 8], [6, 7],
      [5, 9], [5, 8],
      [4, 9]
    ];
    const questions: Question[] = [];
    const shuffled = shuffle(pairs);
    for (let i = 0; i < Math.min(count, shuffled.length); i++) {
      const [a, b] = shuffled[i];
      questions.push({ id: generateId(), content: `${a}+${b}=`, answer: String(a + b), type: 'oral' });
    }
    while (questions.length < count) {
      const [a, b] = shuffled[questions.length % shuffled.length];
      const newA = randomInt(1, 12);
      const newB = randomInt(1, Math.max(1, 20 - newA));
      const sum = newA + newB;
      questions.push({ id: generateId(), content: `${newA}+${newB}=`, answer: String(sum), type: 'oral' });
    }
    return questions;
  },

  'sub-20': (count) => {
    const questions: Question[] = [];
    while (questions.length < count) {
      const a = randomInt(10, 20);
      const b = randomInt(5, a - 1);
      questions.push({ id: generateId(), content: `${a}-${b}=`, answer: String(a - b), type: 'oral' });
    }
    return questions;
  },

  'compare-100': (count) => {
    const questions: Question[] = [];
    const used = new Set<string>();
    while (questions.length < count) {
      const a = randomInt(1, 100);
      const b = randomInt(1, 100);
      const operators = ['>', '<', '='];
      const op = operators[randomInt(0, 2)];
      let correctAnswer: string;
      if (op === '>') correctAnswer = a > b ? '√' : '×';
      else if (op === '<') correctAnswer = a < b ? '√' : '×';
      else correctAnswer = a === b ? '√' : '×';
      const content = `${a}${op}${b}`;
      const key = `${content}-${correctAnswer}`;
      if (!used.has(key) || questions.length >= 3) {
        used.add(key);
        questions.push({ id: generateId(), content, answer: correctAnswer, type: 'oral' });
      }
    }
    return questions;
  },

  'add-sub-tens': (count) => {
    const questions: Question[] = [];
    while (questions.length < count) {
      const type = randomInt(0, 1);
      if (type === 0) {
        const tens = randomInt(1, 9) * 10;
        const ones = randomInt(1, 9);
        questions.push({ id: generateId(), content: `${tens}+${ones}=`, answer: String(tens + ones), type: 'oral' });
      } else {
        const tens = randomInt(1, 9) * 10;
        const ones = randomInt(1, 9);
        const total = tens + ones;
        questions.push({ id: generateId(), content: `${total}-${ones}=`, answer: String(tens), type: 'oral' });
      }
    }
    return questions;
  },

  'tens-add-sub': (count) => {
    const questions: Question[] = [];
    while (questions.length < count) {
      const type = randomInt(0, 1);
      if (type === 0) {
        const a = randomInt(1, 9) * 10;
        const b = randomInt(1, 9) * 10;
        questions.push({ id: generateId(), content: `${a}+${b}=`, answer: String(a + b), type: 'oral' });
      } else {
        const a = randomInt(2, 9) * 10;
        const b = randomInt(1, a / 10 - 1) * 10;
        questions.push({ id: generateId(), content: `${a}-${b}=`, answer: String(a - b), type: 'oral' });
      }
    }
    return questions;
  },

  'add-2digit-no': (count) => {
    const questions: Question[] = [];
    while (questions.length < count) {
      const a = randomInt(11, 89);
      const b = randomInt(11, 99 - a);
      questions.push({ id: generateId(), content: `${a}+${b}=`, answer: String(a + b), type: 'oral' });
    }
    return questions;
  },

  'add-2digit-carry': (count) => {
    const questions: Question[] = [];
    while (questions.length < count) {
      const a = randomInt(15, 89);
      const b = randomInt(15, 99 - a);
      const onesSum = (a % 10) + (b % 10);
      const tensSum = Math.floor(a / 10) + Math.floor(b / 10);
      if (onesSum >= 10 || tensSum * 10 + (onesSum % 10) >= 10) {
        questions.push({ id: generateId(), content: `${a}+${b}=`, answer: String(a + b), type: 'oral' });
      }
    }
    return questions;
  },

  'sub-2digit-no': (count) => {
    const questions: Question[] = [];
    while (questions.length < count) {
      const a = randomInt(22, 99);
      const b = randomInt(11, a - 11);
      if (a % 10 >= b % 10) {
        questions.push({ id: generateId(), content: `${a}-${b}=`, answer: String(a - b), type: 'oral' });
      }
    }
    return questions;
  },

  'sub-2digit-borrow': (count) => {
    const questions: Question[] = [];
    while (questions.length < count) {
      const a = randomInt(21, 99);
      const b = randomInt(11, a - 11);
      if (a % 10 < b % 10) {
        questions.push({ id: generateId(), content: `${a}-${b}=`, answer: String(a - b), type: 'oral' });
      }
    }
    return questions;
  },

  'chain-add-sub': (count) => {
    const questions: Question[] = [];
    while (questions.length < count) {
      const type = randomInt(0, 1);
      if (type === 0) {
        const a = randomInt(10, 50);
        const b = randomInt(10, 60 - a);
        const c = randomInt(10, 99 - a - b);
        questions.push({ id: generateId(), content: `${a}+${b}+${c}=`, answer: String(a + b + c), type: 'oral' });
      } else {
        const result = randomInt(10, 50);
        const b = randomInt(10, 40);
        const c = randomInt(10, 89 - result - b);
        const a = result + b + c;
        questions.push({ id: generateId(), content: `${a}-${b}-${c}=`, answer: String(result), type: 'oral' });
      }
    }
    return questions;
  },

  'mixed-exp': (count) => {
    const questions: Question[] = [];
    while (questions.length < count) {
      const a = randomInt(20, 80);
      const b = randomInt(10, 40);
      const c = randomInt(10, Math.min(60, a + b));
      const result = a + b - c;
      questions.push({ id: generateId(), content: `${a}+${b}-${c}=`, answer: String(result), type: 'oral' });
    }
    return questions;
  },

  'mul-add-sub': (count) => {
    const questions: Question[] = [];
    while (questions.length < count) {
      const type = randomInt(0, 1);
      if (type === 0) {
        const a = randomInt(2, 5);
        const b = randomInt(2, 6);
        const c = randomInt(1, a * b);
        questions.push({ id: generateId(), content: `${a}×${b}+${c}=`, answer: String(a * b + c), type: 'oral' });
      } else {
        const a = randomInt(2, 6);
        const b = randomInt(2, 9);
        const c = randomInt(1, a * b - 1);
        questions.push({ id: generateId(), content: `${a}×${b}-${c}=`, answer: String(a * b - c), type: 'oral' });
      }
    }
    return questions;
  },

  'multiplication': (count) => {
    const questions: Question[] = [];
    const used = new Set<number>();
    while (questions.length < count) {
      const a = randomInt(2, 9);
      const b = randomInt(2, 9);
      if (!used.has(a * 10 + b)) {
        used.add(a * 10 + b);
        questions.push({ id: generateId(), content: `${a}×${b}=`, answer: String(a * b), type: 'oral' });
      }
    }
    return questions;
  },

  'div-26': (count) => {
    const questions: Question[] = [];
    const used = new Set<number>();
    while (questions.length < count) {
      const divisor = randomInt(2, 6);
      const quotient = randomInt(1, 6);
      const dividend = divisor * quotient;
      if (!used.has(dividend)) {
        used.add(dividend);
        questions.push({ id: generateId(), content: `${dividend}÷${divisor}=`, answer: String(quotient), type: 'oral' });
      }
    }
    return questions;
  },

  'div-789': (count) => {
    const questions: Question[] = [];
    const used = new Set<number>();
    while (questions.length < count) {
      const divisor = randomInt(7, 9);
      const quotient = randomInt(1, 9);
      const dividend = divisor * quotient;
      if (!used.has(dividend * 10 + divisor)) {
        used.add(dividend * 10 + divisor);
        questions.push({ id: generateId(), content: `${dividend}÷${divisor}=`, answer: String(quotient), type: 'oral' });
      }
    }
    return questions;
  },

  'mixed-ops': (count) => {
    const questions: Question[] = [];
    while (questions.length < count) {
      const type = randomInt(0, 1);
      if (type === 0) {
        const a = randomInt(10, 40);
        const b = randomInt(2, 6);
        const c = randomInt(1, 9);
        questions.push({ id: generateId(), content: `${a}+${b}×${c}=`, answer: String(a + b * c), type: 'oral' });
      } else {
        const a = randomInt(2, 6);
        const b = randomInt(2, 9);
        const c = randomInt(1, a * b);
        questions.push({ id: generateId(), content: `${a}×${b}-${c}=`, answer: String(a * b - c), type: 'oral' });
      }
    }
    return questions;
  },

  'bracket-ops': (count) => {
    const questions: Question[] = [];
    while (questions.length < count) {
      const type = randomInt(0, 1);
      if (type === 0) {
        const a = randomInt(30, 80);
        const b = randomInt(10, a - 20);
        const c = randomInt(1, 20);
        questions.push({ id: generateId(), content: `(${a}-${b})+${c}=`, answer: String(a - b + c), type: 'oral' });
      } else {
        const a = randomInt(2, 8);
        const b = randomInt(1, 8);
        const c = randomInt(2, 9);
        const dividend = (a + b) * c;
        questions.push({ id: generateId(), content: `(${a}+${b})×${c}=`, answer: String(dividend), type: 'oral' });
      }
    }
    return questions;
  },

  'remainder-div': (count) => {
    const questions: Question[] = [];
    while (questions.length < count) {
      const divisor = randomInt(2, 9);
      const quotient = randomInt(2, 8);
      const remainder = randomInt(1, divisor - 1);
      const dividend = divisor * quotient + remainder;
      questions.push({ id: generateId(), content: `${dividend}÷${divisor}=`, answer: `${quotient}……${remainder}`, type: 'oral' });
    }
    return questions;
  },

  'compare-10000': (count) => {
    const questions: Question[] = [];
    const used = new Set<string>();
    while (questions.length < count) {
      const a = randomInt(1, 9999);
      const b = randomInt(1, 9999);
      const operators = ['>', '<', '='];
      const op = operators[randomInt(0, 2)];
      let correctAnswer: string;
      if (op === '>') correctAnswer = a > b ? '√' : '×';
      else if (op === '<') correctAnswer = a < b ? '√' : '×';
      else correctAnswer = a === b ? '√' : '×';
      const content = `${a}${op}${b}`;
      const key = `${content}-${correctAnswer}`;
      if (!used.has(key) || questions.length >= 3) {
        used.add(key);
        questions.push({ id: generateId(), content, answer: correctAnswer, type: 'oral' });
      }
    }
    return questions;
  },

  'add-sub-10000': (count) => {
    const questions: Question[] = [];
    while (questions.length < count) {
      const type = randomInt(0, 1);
      if (type === 0) {
        const a = randomInt(100, 9000);
        const b = randomInt(100, 9999 - a);
        questions.push({ id: generateId(), content: `${a}+${b}=`, answer: String(a + b), type: 'oral' });
      } else {
        const a = randomInt(200, 9999);
        const b = randomInt(100, a - 100);
        questions.push({ id: generateId(), content: `${a}-${b}=`, answer: String(a - b), type: 'oral' });
      }
    }
    return questions;
  },
};

export const generateQuestions = (knowledgePointId: string, count: number): Question[] => {
  const generator = generators[knowledgePointId];
  if (!generator) {
    return [];
  }
  return generator(count);
};
