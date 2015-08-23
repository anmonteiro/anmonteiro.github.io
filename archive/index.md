---
layout: page
title: Archive
---

{% for post in site.posts %}
  {% capture currentyear %}{{ post.date | date: "%Y" }}{% endcapture %}
  {% if currentyear != year %}
    {% unless forloop.first %}
</ul>
    {% endunless %}
**<h2>{{ currentyear }}</h2>**
<ul class="archive-year">
    {% capture year %}{{ currentyear }}{% endcapture %}
  {% endif %}
  <li><span class="item-date">{{ post.date | date: "%B %-d" }}</span> » <a href="{{ post.url }}">{{ post.title }}</a></li>
{% endfor %}
