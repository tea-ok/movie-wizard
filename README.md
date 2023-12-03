# Movie Wizard :movie_camera: :mage: :crystal_ball:

#### **Still in development. Finishing touches and deployment will be done over the next few days :eyes: **

### Overview

Movie Wizard is a full-stack application which enables users to search through a large (2 million+) database of titles, and add them to their own personal watchlist. Users can also rate titles, as well as leave reviews for other users to see.

### Technologies Used

-   Django :snake:
-   React :atom_symbol:
-   PostgreSQL :elephant:
-   Azure :cloud:

### Motivation

The idea for this project came from the data. I was browsing the internet, looking for a dataset that would give me a lot of interesting data to work with and found the [IMDB Developer Website](https://developer.imdb.com/non-commercial-datasets/), which seemed perfect. The dataset I downloaded contained over 10 million titles, and after cleaning it up a bit, I was left with over 2 million titles. I thought it would be fun to create a website where users could interact with this data, and so Movie Wizard was born.

I decided to use Django for the backend, as I have a lot of experience writing Python, but not in the context of web development. Funnily enough, it's the same thing with React but in a slightly different way. I've used JavaScript a lot for writing APIs with Express and Node.js, but not for frontend development. I thought this would be a great opportunity to learn both of these frameworks, and I'm glad I did!

Azure was chosen as the cloud provider for this project because I wanted to improve my DevOps skills with a large cloud provider that's used by many companies around the world. Working with this combination of technologies has been a great learning experience, and I'm excited to continue working on this project.

### Installation

First, clone the repo and navigate to the root directory.

#### Backend

1. Create a virtual environment and activate it (optional, but recommended):
    ```
    conda create -n movie-wizard
    conda activate movie-wizard
    ```
2. Install the required packages:
    ```
    pip install -r requirements.txt
    ```
3. Create an `.env` file in the [`/movie_wizard/movie_wizard`](./movie_wizard/movie_wizard/) directory and add the following:
    ```
    DATABASE_NAME=db_name
    DATABASE_USER=db_user
    DATABASE_PASSWORD=db_password
    DATABASE_HOST=db_host
    DATABASE_PORT=db_port
    ```
    , assuming you have a Microsoft Azure PostgreSQL server set up with a database. If not, you can modify the [`settings.py`](./movie_wizard/movie_wizard/settings.py) file to use the PostgreSQL database of your choice.
4. Run the migrations:
    ```
    python manage.py migrate
    ```
5. Start the server:
    ```
    python manage.py runserver
    ```
6. Enjoy! Documentation for API endpoints coming soon.

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

### Author

-   **Taavi Kalaluka**
