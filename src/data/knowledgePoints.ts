export interface KnowledgePoint {
  id: string;
  name: string;
  examples: string[];
}

export interface Version {
  id: string;
  name: string;
  displayName: string;
  knowledgePoints: KnowledgePoint[];
}

export const versions: Version[] = [
  {
    id: 'pre-school',
    name: 'pre-school',
    displayName: '学前版',
    knowledgePoints: [
      { id: 'compare-5', name: '5以内数比大小', examples: ['5○3', '4○2', '5○4'] },
      { id: 'add-5', name: '5以内加法', examples: ['3+2', '1+4', '2+2'] },
      { id: 'sub-5', name: '5以内减法', examples: ['5-2', '4-1', '3-1'] },
      { id: 'mixed-5', name: '5以内加减法混合', examples: ['4-1', '2+3', '1+3'] },
    ],
  },
  {
    id: 'grade1-up',
    name: 'grade1-up',
    displayName: '人教版一年级上册',
    knowledgePoints: [
      { id: 'compare-5', name: '1~5比大小', examples: ['5○3', '4○2', '3○3'] },
      { id: 'add-5', name: '1~5加法', examples: ['3+2', '1+4', '2+2'] },
      { id: 'sub-5', name: '1~5减法', examples: ['5-2', '4-1', '3-1'] },
      { id: 'mixed-5', name: '1~5加减法混合', examples: ['4-1', '2+3', '1+2'] },
      { id: 'zero', name: '0的认识和加减法', examples: ['5-0', '0+4', '3-3'] },
      { id: 'compare-10', name: '10以内数比大小', examples: ['8○6', '9○7', '5○5'] },
      { id: 'add-10', name: '10以内加减法', examples: ['7+2', '9-3', '5+4'] },
      { id: 'chain-10', name: '连加连减', examples: ['2+3+4', '8-2-3', '1+2+3'] },
      { id: 'mixed-10', name: '加减混合', examples: ['5+3-2', '9-4+1', '3+2-4'] },
      { id: 'carry-20', name: '20以内进位加法', examples: ['9+7', '8+6', '7+8'] },
    ],
  },
  {
    id: 'grade1-down',
    name: 'grade1-down',
    displayName: '人教版一年级下册',
    knowledgePoints: [
      { id: 'sub-9', name: '十几减9', examples: ['18-9', '17-9', '16-9'] },
      { id: 'sub-876', name: '十几减8、7、6', examples: ['16-8', '15-7', '14-6'] },
      { id: 'sub-5432', name: '十几减5、4、3、2', examples: ['15-5', '12-3', '11-2'] },
      { id: 'compare-20', name: '20以内比大小', examples: ['18○16', '15○18', '14○14'] },
      { id: 'add-20', name: '20以内加法', examples: ['9+7', '8+8', '6+9'] },
      { id: 'sub-20', name: '20以内减法', examples: ['16-7', '15-8', '14-6'] },
      { id: 'compare-100', name: '100以内数比大小', examples: ['89○78', '35○53', '64○64'] },
      { id: 'add-sub-tens', name: '整十数加一位数及减法', examples: ['30+5', '35-5', '40+3'] },
      { id: 'tens-add-sub', name: '整十数加减整十数', examples: ['20+30', '50-20', '40+50'] },
    ],
  },
  {
    id: 'grade2-up',
    name: 'grade2-up',
    displayName: '人教版二年级上册',
    knowledgePoints: [
      { id: 'add-2digit-no', name: '两位数加两位数(不进位)', examples: ['45+54', '23+76', '61+38'] },
      { id: 'add-2digit-carry', name: '两位数加两位数(进位)', examples: ['37+34', '28+45', '59+26'] },
      { id: 'sub-2digit-no', name: '两位数减两位数(不退位)', examples: ['37-25', '68-45', '89-63'] },
      { id: 'sub-2digit-borrow', name: '两位数减两位数(退位)', examples: ['37-29', '54-38', '81-47'] },
      { id: 'chain-add-sub', name: '连加、连减', examples: ['12+25+36', '88-16-9', '45+23+17'] },
      { id: 'mixed-exp', name: '加减混合', examples: ['64+17-25', '85-30+12', '45+18-23'] },
      { id: 'mul-add-sub', name: '乘加乘减', examples: ['3×4+2', '5×5-3', '4×3+5'] },
      { id: 'multiplication', name: '表内乘法(2-9乘法口诀)', examples: ['3×4', '7×8', '6×9'] },
    ],
  },
  {
    id: 'grade2-down',
    name: 'grade2-down',
    displayName: '人教版二年级下册',
    knowledgePoints: [
      { id: 'div-26', name: '用2~6的乘法口诀求商', examples: ['10÷2', '12÷3', '15÷5'] },
      { id: 'div-789', name: '用7、8、9的乘法口诀求商', examples: ['35÷7', '48÷8', '63÷9'] },
      { id: 'mixed-ops', name: '混合运算', examples: ['36+6×7', '4×7-5', '8+2×9'] },
      { id: 'bracket-ops', name: '带括号的混合运算', examples: ['(77-35)+7', '(15+9)÷4', '(48-16)÷8'] },
      { id: 'remainder-div', name: '有余数除法', examples: ['33÷8', '25÷7', '38÷5'] },
      { id: 'compare-10000', name: '万以内的数比大小', examples: ['899○111', '1234○987', '3456○3456'] },
      { id: 'add-sub-10000', name: '万以内加减法', examples: ['1200+300', '1500-400', '2500+750'] },
    ],
  },
];

export const getVersionById = (id: string): Version | undefined => {
  return versions.find(v => v.id === id);
};

export const getKnowledgePointById = (versionId: string, kpId: string): KnowledgePoint | undefined => {
  const version = getVersionById(versionId);
  return version?.knowledgePoints.find(kp => kp.id === kpId);
};
