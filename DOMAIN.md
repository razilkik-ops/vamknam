# Как подключить vamknam.by к GitHub Pages

1. Откройте [настройки Pages репозитория](https://github.com/razilkik-ops/vamknam/settings/pages). В поле **Custom domain** укажите `vamknam.by` и сохраните. Сначала добавляется домен в GitHub, затем меняется DNS.
2. В панели управления DNS у регистратора домена добавьте записи:

| Тип | Имя | Значение |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | razilkik-ops.github.io |

`@` означает основной домен. Если панель требует полное имя, укажите `vamknam.by`. В CNAME указывается только `razilkik-ops.github.io`, без `https://` и без `/vamknam/`.

3. Дождитесь успешной проверки DNS в GitHub Pages и включите **Enforce HTTPS**, когда переключатель станет доступен. Обновление DNS и выпуск HTTPS могут занимать до 24 часов.

Действующие записи почты MX/TXT менять не требуется. Старые конфликтующие A/AAAA/CNAME для основного домена и www нужно заменить записями выбранного хостинга. Названия пунктов в панели зависят от регистратора.

Используем публикацию через GitHub Actions: отдельный файл CNAME в репозитории для этой схемы не требуется.

Источник: [официальная инструкция GitHub Pages](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).
