# Подключение SonarQube Cloud

В репозитории настроены `sonar-project.properties`, запуск Vitest с покрытием
и шаг анализа в `.github/workflows/ci.yml` для проекта
[SK0LX_react-urfu-project-81](https://sonarcloud.io/summary/overall?id=SK0LX_react-urfu-project-81&branch=main).
Ключи проекта и организации подтверждены на странице Information и сохранены
в `sonar-project.properties`. Для активации анализа нужен секрет `SONAR_TOKEN`.

## 1. Подключить репозиторий

Войдите в [SonarQube Cloud](https://sonarcloud.io/) через GitHub, выберите свою
организацию и импортируйте `SK0LX/react-urfu-project-81`.
В настройке метода анализа выберите **With GitHub Actions**, тип сборки —
**Other (for JS, TS, Go, Python, PHP, …)**.

Если проект уже использует автоматический анализ, откройте
**Administration → Analysis Method** и отключите **Automatic Analysis**.
Покрытие передаётся через CI-based analysis, как описано в
[документации SonarQube](https://docs.sonarsource.com/sonarqube-cloud/analyzing-source-code/test-coverage/javascript-typescript-test-coverage).

## 2. Сохранить токен в GitHub

В SonarQube откройте **My account → Access Tokens → Personal Tokens**,
задайте имя и срок действия токена, затем нажмите **Generate Token** и скопируйте значение.

Откройте [Settings → Secrets and variables → Actions](https://github.com/SK0LX/react-urfu-project-81/settings/secrets/actions).
На вкладке **Secrets** через **New repository secret** сохраните токен под именем
`SONAR_TOKEN`. Токен хранится только в секрете GitHub;
он не нужен в исходниках, README, `sonar-project.properties` или переменных Actions.

Публичные ключи уже находятся в конфигурации:

| Параметр | Значение |
| --- | --- |
| `sonar.projectKey` | `SK0LX_react-urfu-project-81` |
| `sonar.organization` | `sk0lx` |

Переменные GitHub `SONAR_PROJECT_KEY` и `SONAR_ORGANIZATION` больше не используются.

Параметры анализа соответствуют
[официальной настройке GitHub Actions](https://docs.sonarsource.com/sonarqube-cloud/analyzing-source-code/ci-based-analysis/github-actions-for-sonarcloud).

## 3. Проверить первый запуск

После отправки файлов настройки в GitHub откройте **Actions → CI**.
Workflow также можно запустить вручную через **Run workflow**.

Проверьте успешное завершение линтера, проверки типов, тестов, сборки и анализа
SonarQube. На стороне SonarQube должен появиться анализ с метрикой Coverage.

В этом проекте шаг SonarQube выполняется при push и pull request из того же
репозитория. Действующий `SONAR_TOKEN` обязателен: ошибка аутентификации приведёт
к ошибке шага анализа. Для pull request из форка анализ пропускается.

Установка в CI выполняется с `--ignore-scripts`; сборка запускается отдельным
шагом. Версии GitHub Actions в нашем workflow закреплены по полным SHA.
Сгенерированный `hexlet-check.yml` исключён из анализа, поскольку Хекслет
запрещает его редактирование. HTML-фикстуры проверяются тестами и не входят
в анализ исходников SonarQube.

## 4. Добавить бейджики

Бейджики CI, Quality Gate и Coverage уже добавлены в README и ссылаются
на этот репозиторий и подтверждённый проект SonarQube.

В SonarQube откройте **Information → Badges**. Скопируйте Markdown для
**Quality gate badge**, затем для **Standard badge** с метрикой **Coverage**.
При изменении проекта замените соответствующие строки в начале README.
Эти действия описаны в разделе
[Using a project badge](https://docs.sonarsource.com/sonarqube-cloud/managing-your-projects/managing-your-project-as-developer#using-a-project-badge).

Значения ключей проекта и URL бейджиков берутся из созданного проекта SonarQube.
