import HexletCode from '@hexlet/code';

const template = { name: 'rob', job: 'hexlet', gender: 'm' };

const form = HexletCode.formFor(template, { method: 'post' }, (f) => {
  f.input('name');
  f.input('job', { as: 'textarea' });
  f.submit('Wow');
});

console.log(form);
