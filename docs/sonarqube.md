# Подключение SonarQube Cloud

В репозитории подготовлены `sonar-project.properties`, запуск Vitest с покрытием
и шаг анализа в `.github/workflows/ci.yml`. Для активации анализа нужно связать
реальный проект SonarQube Cloud с GitHub и сохранить настройки ниже.

## 1. Подключить репозиторий

Войдите в [SonarQube Cloud](https://sonarcloud.io/) через GitHub, выберите свою
организацию и импортируйте `SK0LX/react-urfu-project-81`.
В настройке метода анализа выберите **With GitHub Actions**, тип сборки —
**Other (for JS, TS, Go, Python, PHP, …)**.

Если проект уже использует автоматический анализ, откройте
**Administration → Analysis Method** и отключите **Automatic Analysis**.
Покрытие передаётся через CI-based analysis, как описано в
[документации SonarQube](https://docs.sonarsource.com/sonarqube-cloud/analyzing-source-code/test-coverage/javascript-typescript-test-coverage).

## 2. Сохранить настройки в GitHub

На странице **Information** проекта SonarQube скопируйте project key и organization key.
Откройте [Settings → Secrets and variables → Actions](https://github.com/SK0LX/react-urfu-project-81/settings/secrets/actions).

На вкладке **Variables** через **New repository variable** добавьте:

| Имя | Значение |
| --- | --- |
| `SONAR_PROJECT_KEY` | Project key из SonarQube |
| `SONAR_ORGANIZATION` | Organization key из SonarQube |

Получите токен анализа по инструкции настройки проекта SonarQube.
На вкладке **Secrets** в GitHub через **New repository secret** сохраните его
под именем `SONAR_TOKEN`. Токен хранится только в секрете GitHub;
он не нужен в исходниках, README, `sonar-project.properties` или переменных Actions.

Параметры анализа соответствуют
[официальной настройке GitHub Actions](https://docs.sonarsource.com/sonarqube-cloud/analyzing-source-code/ci-based-analysis/github-actions-for-sonarcloud).

## 3. Проверить первый запуск

После отправки файлов настройки в GitHub откройте **Actions → CI**.
Workflow также можно запустить вручную через **Run workflow**.

Проверьте успешное завершение линтера, проверки типов, тестов, сборки и анализа
SonarQube. На стороне SonarQube должен появиться анализ с метрикой Coverage.

До заполнения переменных шаг SonarQube пропускается, остальные проверки работают.
После заполнения переменных действующий `SONAR_TOKEN` обязателен: ошибка
аутентификации приведёт к ошибке шага анализа.

## 4. Добавить бейджики

Бейджик CI уже добавлен в README и ссылается на workflow этого репозитория.

В SonarQube откройте **Information → Badges**. Скопируйте Markdown для
**Quality gate badge**, затем для **Standard badge** с метрикой **Coverage**.
Вставьте обе строки рядом с бейджиками в начале README.
Эти действия описаны в разделе
[Using a project badge](https://docs.sonarsource.com/sonarqube-cloud/managing-your-projects/managing-your-project-as-developer#using-a-project-badge).

Значения ключей проекта и URL бейджиков берутся из созданного проекта SonarQube.
