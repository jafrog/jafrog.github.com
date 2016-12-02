---
layout: post
title: Analyze Segment data with Elastic Search
summary: How to set up Amazon ES and get events from Segment
---

Data is good. Searchable data about users' behavior is even better. Add backups and you have a legacy to be remembered by.

At Makers Academy we use [Segment](https://segment.com) - a tool that collects all of your tracking in one place. And we track a lot of things. Some of these things are in the domain of Google Analytics, but some of the data is left largely unseen. Let's try to fix it.

# The setup

We're going to build a pipeline that looks like this:

![Diagram](/assets/posts/es-setup/diagram.png)

① We enable a webhook in Segment to forward all data to the designated API endpoint.

② The webhook points to a [Amazon API gateway](https://aws.amazon.com/documentation/apigateway) endpoint.

③ API gateway serves as proxy for [Amazon Kinesis Firehose](https://aws.amazon.com/documentation/kinesis/).

④ Firehose dumps data to [Amazon Elasticsearch](https://aws.amazon.com/elasticsearch-service/) and to [Amazon S3](https://aws.amazon.com/s3/).

⑤ Amazon Elasticsearch service already has Kibana plugin installed so you can start visualizing data immediately.

# Amazon ES

First we're going to create an Elasticsearch domain.

Go to `Services -> Elasticsearch Service` in your AWS console and click `Create new domain`.

Pick a domain name. I used `kibana-2` because the rest of the business refers to this setup as "Kibana" and because it wasn't my first attempt to set up "Kibana".

When you get to the `Set up access policy` tab select `Allow open access to the domain`. It's the easiest way to get started and test your pipeline.

And that's pretty much it for the Elasticsearch + Kibana setup. When you create a domain you will see a link to the Kibana interface. It's not going to show anything yet, but it's nice to know that it's there.

![ES setup](/assets/posts/es-setup/es_setup.png)

# Kinesis Firehose

We will create a delivery stream in Kinesis Firehose to deliver data to the Elasticsearch domain. Go to the `Kinesis` service -> `Firehose` and click `Create delivery stream`.

![Firehose Step 1](/assets/posts/es-setup/firehose_1.png)

It's up to you to decide whether you want to back up all of the data to S3 or only failed documents. One advantage of backing up everything is that your analytics data will be there forever even if you decide to disable Elasticsearch at some point.

To allow your delivery stream access to Elasticsearch you need to create a AIM *role* (or pick an existing one) and attach a *policy* to it.

![Firehose Step 2](/assets/posts/es-setup/firehose_2.png)

When you choose to create or update a role in the dropdown a new screen will open. Type in a role name, keep `Create a new Role policy` and click `Allow`.

![Firehose AIM](/assets/posts/es-setup/firehose_aim.png)

Finish the setup and you're ready to test the Firehose to ES integration with the built-in test tool.

![Firehose Test](/assets/posts/es-setup/firehose_test.png)

# API Gateway

Segment has a built-in integration with Amazon Kinesis. Unfortunately it only integrates with Kinesis Streams. We don't need Kinesis Streams, we need to pipe data to Kinesis Firehose.

Amazon API Gateway can act as proxy to many Amazon services. It's handy because you don't have to worry about authentication and access rights (almost). So we're going to set up an API endpoint to be a proxy for Kinesis Firehose.

## AIM Role

First we'll need to create a [AIM](https://aws.amazon.com/iam/) Role to allow API Gateway access to Firehose.

Go to `Services -> AIM -> Roles -> Create Role` in the AWS console. Select `Amazon API Gateway` as the Role Type and finish creating the role.

![API Role 1](/assets/posts/es-setup/api_role_1.png)

Now go to the role page and click `Attach Policy`.

![API Role 2](/assets/posts/es-setup/api_role_2.png)

Start typing "Firehose" in the search input and select `AmazonKinesisFirehoseFullAccess` policy.

![API Role 3](/assets/posts/es-setup/api_role_3.png)

The new role should look similar to this:

![API Role 4](/assets/posts/es-setup/api_role_4.png)

Now on to setting up the API endpoint.

## API Setup

To do this go to `Services -> API Gateway -> Create API` in the AWS console.

Our API is going to have just one `POST` method for the `/` resource. So select `Actions -> Create Method`.

![Create Method](/assets/posts/es-setup/create_method.png)

Select method `POST`. The config for the method should look something like this:

![Method config](/assets/posts/es-setup/method_config.png)

When API Gateway passes the request through it needs to change the content type from `application/json` to `application/x-amz-json-1.1`.

![Content Type](/assets/posts/es-setup/content_type.png)

Last but not least we need to set up JSON data mapping to specify what Firehose stream we want to send data to and in what format. You can set it up in the `Body Mapping Templates` section.

![JSON Mapping](/assets/posts/es-setup/json_mapping.png)

The code for mapping:

{%highlight javascript%}
  {
    "DeliveryStreamName": "Analytics-ES", // replace with the name of your Firehose stream
    "Record": {
      "Data": "$util.base64Encode($input.json('$'))" // take the whole JSON sent by Segment, encode it in Base64 and pass through
    }
  }
{%endhighlight%}

Now we can test the API to make sure the data comes through to Firehose nicely.

![API Test](/assets/posts/es-setup/api_test_1.png)

Add Content-type `application/json` and put some dummy JSON in `Request Body`. The successful request should get `RecordId` in response.

![API Test Result](/assets/posts/es-setup/api_test_2.png)

Deploy the API by selecting `Actions -> Deploy API` and you're good to go!

# Segment integration

The last step is to add a Segment integration. Find out your API URL on the `Stages` page.

![API URL](/assets/posts/es-setup/api_url.png)

Login to Segment, go to the `Integrations -> Webhooks` and add the URL you copied.

![Segment Webhook](/assets/posts/es-setup/segment_webhook.png)

And you're done! Now all of the Segment analytics will be available to see in the Kibana console.

