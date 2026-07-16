# Abdul Mukthadir Portfolio

This repository contains my personal portfolio website showcasing my skills, projects, and experience in Cloud Computing, AWS, and Data Engineering.

## Live Demo

CloudFront (HTTPS)

https://d1f6q6tt4549t5.cloudfront.net

S3 Static Website

http://abdulmukthadir-portfolio.s3-website-us-east-1.amazonaws.com

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Amazon S3
- Amazon CloudFront
- Git
- GitHub

## AWS Architecture

```
GitHub Repository
        │
        ▼
AWS CloudShell
        │
        ▼
aws s3 sync
        │
        ▼
Amazon S3
(Static Website Hosting)
        │
        ▼
Amazon CloudFront
(CDN + HTTPS)
        │
        ▼
Live Portfolio
```

## Project Structure

```
Portfolio/
├── index.html
├── style.css
├── script.js
└── README.md
```

## Features

- Responsive portfolio website
- Modern and clean user interface
- Hosted using Amazon S3 Static Website Hosting
- HTTPS enabled through Amazon CloudFront
- Global content delivery using CloudFront CDN

## Deployment

1. Clone the repository.

```bash
git clone https://github.com/abdulmukthadir/Portfolio.git
```

2. Upload the project to an S3 bucket.

```bash
aws s3 sync . s3://abdulmukthadir-portfolio
```

3. Configure S3 Static Website Hosting.

4. Create a CloudFront distribution with the S3 website endpoint as the origin.

5. Set `index.html` as the Default Root Object.

6. Create a CloudFront invalidation after updates.

## Contact

GitHub: https://github.com/abdulmukthadir

LinkedIn: https://www.linkedin.com/in/abdulmukthadir/

#Will include CI/CD soon 