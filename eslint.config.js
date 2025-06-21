const path = require('path');

module.exports = [
  {
    rules: {
      // 상대 경로 사용 금지
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['..*'],
              message: '상대 경로 대신 절대 경로(@/...)를 사용해주세요.',
            },
          ],
        },
      ],
    },
  },
];
