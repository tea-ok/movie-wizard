# Movie Wizard :movie_camera: :mage: :crystal_ball:

![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![DjangoREST](https://img.shields.io/badge/DJANGO-REST-ff1709?style=for-the-badge&logo=django&logoColor=white&color=ff1709&labelColor=gray)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Azure](https://img.shields.io/badge/azure-%230072C6.svg?style=for-the-badge&logo=microsoftazure&logoColor=white)

### Overview

Movie Wizard is a full-stack application which enables users to search through a large (2 million+) database of titles, and add them to their own personal watchlist. Users can also rate titles, as well as leave reviews for other users to see.

### Technologies Used

-   Django :snake:
-   React :atom_symbol:
-   PostgreSQL :elephant:
-   Azure :cloud:

### Motivation

The idea for this project came from the data. I was browsing the internet, looking for a dataset that would give me a lot of interesting data to work with and found the [IMDB Developer Website](https://developer.imdb.com/non-commercial-datasets/), which seemed perfect. The dataset I downloaded contained over 10 million titles, and after cleaning it up a bit, I was left with over 2 million titles. I thought it would be fun to create a website where users could interact with this data, and so Movie Wizard was born.

I decided to use Django for the backend, as it is a robust and feature-rich framework. I also have a lot of experience writing Python, but not in the context of web development, so I thought the learning curve wouldn't be too steep. Funnily enough, it's a similar situation with JavaScript and React. I've used JavaScript a lot for writing APIs with Express and Node.js, but not for frontend development. React is the gold-standard for frontend, so that was a pretty simple choice. I thought this would be a great opportunity to learn both Django and React, and I'm glad I did!

Azure was chosen as the cloud provider for this project because I wanted to improve my DevOps skills with a large cloud provider that's used by many companies around the world. Working with this combination of technologies has been a great learning experience, and I'm excited to continue working on this project.

### Installation

First, clone the repo and navigate to the root directory.

#### Backend

1. Create a virtual environment and activate it (optional, but recommended. Shown here with Anaconda):
    ```
    conda create -n movie-wizard
    conda activate movie-wizard
    ```
2. Install the required packages:
    ```
    pip install -r requirements.txt
    ```
3. Navigate to the [`/movie_wizard/movie_wizard`](./movie_wizard/movie_wizard/) directory and add an `.env` file with the following variables:

    ```
    DATABASE_NAME=db_name
    DATABASE_USER=db_user
    DATABASE_PASSWORD=db_password
    DATABASE_HOST=db_host
    DATABASE_PORT=db_port
    ```

    , assuming you have a Microsoft Azure PostgreSQL server set up with a database. If not, you can modify the [`settings.py`](./movie_wizard/movie_wizard/settings.py) file to use the PostgreSQL database of your choice.

4. Populate the `titles_title` table with some data. You can write your own script to insert some mock data, or download the IMDB dataset [here](https://datasets.imdbws.com/title.basics.tsv.gz) and perform data cleaning similar to what I did in [data.ipynb](./data/data.ipynb). Then, you can run a script like the one I created [populate_db.py](./scripts/populate_db.py) to populate the database. This can take a few minutes, as there are over 2 million titles in the dataset after cleaning.

5. Run the migrations:
    ```
    python manage.py migrate
    ```
6. Start the server:
    ```
    python manage.py runserver
    ```
7. Enjoy! Here's the documentation: [docs](https://documenter.getpostman.com/view/24394414/2s9YkgE5aP)

#### Frontend

1. Navigate to the [`/movie_wizard/frontend`](./movie_wizard/frontend/) directory.
2. Install the required packages:
    ```
    npm install
    ```
    , assuming you have `npm` installed.
3. Start the frontend:
    ```
    npm start
    ```

### Database Schema

Django's ORM was used to create the database schema. It adds a few extra tables for authentication and session management, but the main tables are shown below (generated with PgAdmin):

![Database Schema](./docs/images/ERD.jpeg)

### Author

-   **Taavi Kalaluka**
