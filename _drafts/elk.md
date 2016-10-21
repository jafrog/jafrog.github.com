---
layout: post
summary: Setting up monitoring and data visualization in 124 simple steps
---

This is a ground up tutorial on how to set up an Elastic (former ELK) stack on Amazon EC2 instance.

### Why?

To collect and analyze logs and analytics data.

### What is ELK?

`ELK` stands for ElasticSearch, Logstash and Kibana.

[*Logstash*](https://www.elastic.co/products/logstash) is a tool that collects text data from various sources (TCP dumps, HTTP, syslog), parses, tags and modifies it according to the config and passes it to the next tool in your pipeline. In this case it's going to be ElasticSearch.

[*ElasticSearch*](https://www.elastic.co/products/elasticsearch) is another tool that **indexes** text data making it searchable. In this setup Elasticsearch takes input from Logstash.

[*Kibana*](https://www.elastic.co/products/kibana) is a data visualization tool. It's basically a GUI for the data in your Elasticsearch cluster.

### The overview

Explain what Logstash is and what it does.

Explain what Elasticsearch does.

Explain what is Kibana.

Explain where it all runs.

### Creating an EC2 instance

Explain what EC2 instance is.

Explain how to set up Ubuntu box on EC2.

### Setting up Logstash

Installing and running Logstash. Draining Heroku logs to Logstash.

### Setting up Elasticsearch

