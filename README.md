# Toluwanimi Babalola — Portfolio

Personal portfolio site for Toluwanimi Babalola, front-end developer.

Live: https://toluwanimibabalolasportfolio.netlify.app/

## Structure

```
index.html            Home page (hero, about, skills, projects, services, AI assistant, contact)
index.css             Shared styles for every page
css/ai-chatbot.css    Styles for the AI assistant widget
js/main.js            Navigation, tabs, scroll reveal, contact form feedback
js/ai-chatbot/        Rule-based AI assistant (ES modules, no build step)
projects/             Projects listing and case-study pages
thank-you.html        Redirect target after the contact form is submitted
assets/               Images, video, and CV (assets/docs/cv.pdf)
```

## Running locally

It's a static site with no build step. Because the chatbot uses ES modules, serve it over HTTP rather than opening the file directly:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

The contact form posts to [FormSubmit](https://formsubmit.co/).
