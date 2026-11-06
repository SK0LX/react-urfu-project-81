# Генератор форм на Typescript

[![hexlet-check](https://github.com/SK0LX/react-urfu-project-81/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/SK0LX/react-urfu-project-81/actions)
[![CI](https://github.com/SK0LX/react-urfu-project-81/actions/workflows/ci.yml/badge.svg)](https://github.com/SK0LX/react-urfu-project-81/actions/workflows/ci.yml)
[![Quality gate status](https://sonarcloud.io/api/project_badges/measure?project=SK0LX_react-urfu-project-81&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=SK0LX_react-urfu-project-81)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=SK0LX_react-urfu-project-81&metric=coverage)](https://sonarcloud.io/summary/new_code?id=SK0LX_react-urfu-project-81)

Библиотека `@hexlet/code` для генерации HTML-форм.

Класс `HexletCode` экспортируется по умолчанию. Его статический метод `formFor`
возвращает HTML-строку, используя значения из переданного объекта.

Учебный проект Хекслета: https://ru.hexlet.io/


## Стек

- TypeScript
- Node.js 24+ и NPM
- ES-модули
- ESLint и Vitest

## Установка

```bash
git clone https://github.com/SK0LX/react-urfu-project-81.git
cd react-urfu-project-81
npm install
```

При установке зависимостей скрипт `prepare` автоматически собирает пакет.

## Разработка

```bash
make lint
make typecheck
make test
make test-coverage
make build
npm run example
```

`make check` последовательно запускает линтер, проверку типов, тесты с покрытием
и сборку. Эти же проверки выполняются в GitHub Actions при push и pull request.
Каждая команда Makefile вызывает соответствующий NPM-скрипт.

Для разработки через тесты запустите `npm run test:watch`: сначала добавьте
тест нового поведения и убедитесь, что он падает, затем реализуйте поведение
и выполните `make check` перед отправкой изменений.

Тесты находятся в `__tests__/`, дополнительные данные — в `__fixtures__/`.
Vitest проверяет исходники без предварительной сборки. Команда
`make test-coverage` создаёт HTML-отчёт `coverage/index.html` и LCOV-отчёт
`coverage/lcov.info`. Минимальное покрытие строк, функций, инструкций и ветвлений — 80%.
Из покрытия исключены файлы экспортов, интерфейсов и типов.

TypeScript закреплён на совместимой с `typescript-eslint` ветке 6.0.
Для транзитивной зависимости `minimatch` задана исправленная версия через `overrides`.
В зависимостях AJV парсер `uri-js` заменён на `fast-uri@4.2.3`;
совместимость ESLint проверяется отдельными тестами.
Подробности и состояние предупреждения `picomatch` описаны в
[разборе рисков зависимостей](docs/dependency-risks.md).

Исходники находятся в `src/`. Сборка создаёт JavaScript-файлы и декларации
типов `.d.ts` в `dist/`.

## Локальное использование

В другом NPM-проекте установите библиотеку по пути к этому репозиторию:

```bash
npm install /absolute/path/to/react-urfu-project-81
```

Импортируйте класс из ES-модуля, например из файла `example.mjs`:

```javascript
import HexletCode from '@hexlet/code';

const template = { name: 'rob', job: 'hexlet', gender: 'm' };

const form = HexletCode.formFor(template, { method: 'post' }, (f) => {
  f.input('name');
  f.input('job', { as: 'textarea' });
  f.submit();
});

console.log(form);
```

Результат возвращается одной строкой; здесь он разбит на строки для удобства:

```html
<form method="post" action="#">
  <label for="name">Name</label>
  <input name="name" type="text" value="rob">
  <label for="job">Job</label>
  <textarea cols="20" rows="40" name="job">hexlet</textarea>
  <input type="submit" value="Save">
</form>
```

Публикация в NPM для локального использования не требуется.

## Генерация пустой формы

Заполненный шаблон определяет доступные данные. Если callback не добавляет
элементы, результатом будет пустая форма:

```javascript
import HexletCode from '@hexlet/code';

const template = { name: 'rob', job: 'hexlet', gender: 'm' };

console.log(HexletCode.formFor(template, {}, () => {}));
// <form method="post" action="#"></form>

console.log(HexletCode.formFor(template, { url: '/users' }, () => {}));
// <form method="post" action="/users"></form>
```

Поля из шаблона не добавляются автоматически. Опция `url` задаёт адрес отправки
формы, а метод по умолчанию — `post`.
Эти сценарии проверяются через публичный API в `__tests__/empty-form.test.ts`.

## Генерация полей

`input()` создаёт подпись `label` и текстовое поле со значением из шаблона.
Текст подписи берётся из имени поля с заглавной первой буквой: `name` → `Name`.
Дополнительные HTML-атрибуты передаются вторым аргументом:

```javascript
const form = HexletCode.formFor(template, {}, (f) => {
  f.input('name', { class: 'user-input' });
  f.input('job');
});

console.log(form);
// <form method="post" action="#"><label for="name">Name</label><input name="name" type="text" value="rob" class="user-input"><label for="job">Job</label><input name="job" type="text" value="hexlet"></form>
```

Опция `as: 'textarea'` выбирает многострочное поле с `cols="20"` и `rows="40"`.
Значения по умолчанию можно переопределить:

```javascript
const form = HexletCode.formFor(template, { url: '#' }, (f) => {
  f.input('job', { as: 'textarea', rows: 50, cols: 50 });
});

console.log(form);
// <form method="post" action="#"><label for="job">Job</label><textarea cols="50" rows="50" name="job">hexlet</textarea></form>
```

Элементы выводятся в порядке вызовов `input()`. Опция `as` используется только
для выбора элемента и не попадает в HTML. При вызове `f.input('age')`, если
поля `age` нет в шаблоне, возникает ошибка `Field 'age' does not exist in the template.`
Примеры проверяются в `__tests__/input.test.ts` по HTML-файлам из `__fixtures__/`.

Текст подписи можно изменить через `label`, а её HTML-атрибуты — через `labelHtml`:

```javascript
const form = HexletCode.formFor(template, {}, (f) => {
  f.input('name', {
    label: 'User',
    labelHtml: { class: 'form-label', id: 'name-label' },
  });
  f.submit('Ok');
});

console.log(form);
// <form method="post" action="#"><label for="name" class="form-label" id="name-label">User</label><input name="name" type="text" value="rob"><input type="submit" value="Ok"></form>
```

`as`, `label` и `labelHtml` управляют генерацией и не выводятся атрибутами поля.
Значения обычных HTML-атрибутов поля должны быть строками, числами, булевыми
значениями, `null` или `undefined`.

## Кнопка отправки

`submit()` добавляет `<input type="submit" value="Save">`. Первый аргумент
переопределяет текст кнопки:

```javascript
const form = HexletCode.formFor(template, { method: 'post' }, (f) => {
  f.input('name');
  f.input('job', { as: 'textarea' });
  f.submit('Wow');
});

console.log(form);
// <form method="post" action="#"><label for="name">Name</label><input name="name" type="text" value="rob"><label for="job">Job</label><textarea cols="20" rows="40" name="job">hexlet</textarea><input type="submit" value="Wow"></form>
```

Подписи создаются для текстовых и многострочных полей. Для кнопки отправки
подпись не добавляется. Без `as: 'textarea'` вызов `input('job')` создаёт
обычное текстовое поле. Сами вызовы `submit()` проверяются в `__tests__/submit.test.ts`.
Отправку формы на адрес `action` с методом `method` выполняет браузер.

## Внутренняя генерация тегов

Класс `Tag` находится в `src/shared/libs/tag-renderer/` и используется
через сервис `HtmlTagRenderer`. Он является внутренним модулем библиотеки
и не экспортируется из корня пакета.

`new Tag(name, attributes = {}, content = '')` поддерживает одинарные и парные теги.
Для одинарных тегов содержимое пропускается. Атрибуты сохраняют порядок передачи,
а их значения экранируются.

`content` принимается как готовый HTML для вложенных тегов. При генерации формы
подписи и содержимое `textarea` экранирует `HtmlFormRenderer`.

## API

- `HexletCode.formFor(template, options = {}, callback?)` создаёт форму.
  По умолчанию используются `action="#"` и `method="post"`.
  Опция `url` задаёт `action`; также можно передать `action` напрямую.
  Остальные параметры становятся HTML-атрибутами формы.
  При генерации `method` выводится перед `action` для совместимости с проверкой Хекслета.
- `f.input(name, options = {})` добавляет подпись и текстовое поле со значением
  `template[name]`. Опция `as: 'textarea'` создаёт многострочное поле
  с `cols="20"` и `rows="40"`. HTML-атрибуты можно переопределять через `options`.
  Опции `label` и `labelHtml` задают текст и атрибуты подписи.
- `f.submit(value = 'Save', attributes = {})` добавляет кнопку отправки.

Порядок вызовов определяет порядок элементов. Неизвестное поле или
неподдерживаемый вид элемента вызывает ошибку. В TypeScript имена полей
ограничены ключами объекта `template`.

Текст и значения атрибутов экранируются. Булевы атрибуты со значением `true`
выводятся без значения, а `false`, `null` и `undefined` пропускаются.
Значения полей `null` и `undefined` превращаются в пустую строку.
Исходные данные и объекты параметров не изменяются.

## Устройство

- `src/index.ts` — точка входа пакета, экспорт класса и публичных типов.
- `src/hexlet-code.ts` — метод `formFor` и создание сервисов.
- `src/shared/libs/form-builder/` — интерфейс `FormBuilder` и реализация `DefaultFormBuilder`.
  Собирает описания полей, их подписи и кнопки, проверяет наличие данных.
- `src/shared/libs/form-renderer/` — интерфейс `FormRenderer` и реализация `HtmlFormRenderer`.
  Преобразует описания элементов в форму, получая `TagRenderer` через конструктор.
- `src/shared/libs/tag-renderer/` — интерфейс `TagRenderer` и реализация `HtmlTagRenderer`.
  Сервис делегирует генерацию HTML классу `Tag`; одинарные теги перечислены в `void-tags.constant.ts`.
- `src/shared/helpers/` — общие функции, включая экранирование HTML.
- `src/shared/types/` — типы параметров, атрибутов и описаний элементов.
- `examples/basic.mjs` — запускаемый пример из задания.
- `__tests__/` — тесты Vitest для тегов, форм и подстановки сервисов через интерфейсы.
- `__fixtures__/` — дополнительные данные для тестов.

Каждая библиотека в `shared/libs` экспортирует интерфейс и реализацию через
свой `index.ts`. Зависимости между сервисами описаны интерфейсами.
Конкретные реализации создаются в `HexletCode.formFor`.

Внутреннее описание формы — список обычных объектов. Поля содержат вид элемента,
имя, текст и атрибуты подписи, значение и атрибуты поля; кнопки — вид элемента,
значение и атрибуты.
Готовую HTML-разметку создаёт отдельный `FormRenderer`.

## GitHub Actions и SonarQube

Workflow `.github/workflows/ci.yml` устанавливает зависимости через `npm ci --ignore-scripts`,
запускает линтер, проверку типов, тесты с покрытием и сборку пакета.
Основной CI работает без секретов SonarQube.

Автоматический анализ SonarQube использует `.sonarcloud.properties`: проверяет
`src/`, наш workflow `ci.yml` и тесты из `__tests__/`.
HTML-фикстуры из `__fixtures__/` содержат эталонные строки из задания и не входят
в область анализа исходников.

Конфигурация отдельного CI-based analysis сохранена в `sonar-project.properties`.
Автоматический анализ этот файл не использует. Отправка `coverage/lcov.info`
в SonarQube через основной CI отключена.

Параметры отдельного подключения SonarQube и настройки бейджиков описаны
в [инструкции](docs/sonarqube.md). Бейджики показывают результаты анализа SonarQube;
локальный отчёт покрытия доступен в `coverage/index.html`.

---

<details>
<summary>Автоматические тесты Хекслета</summary>

Тесты запускаются на каждый коммит. За запуск отвечает файл `.github/workflows/hexlet-check.yml` — не удаляйте и не переименовывайте ни его, ни репозиторий.

</details>

## О Хекслете

[Хекслет](https://ru.hexlet.io/) — школа программирования: авторские программы обучения с практикой, поддержкой наставников и реальными проектами, которые остаются в резюме. Этот репозиторий — один из таких проектов.
