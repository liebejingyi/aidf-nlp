# aidf-nlp
## Objective
This readme describes the steps involved in setting up your local development environment for the AIDF-NLP website.

### Setting up a development environment
1. Clone this project into a local folder.
1. This project depends on Python 3.9.6 64bit, so go ahead and download the 64 bit version from [https://www.python.org/downloads/release/python-396/].
1. We also need the Visual C++ Compiler(14.x) for Python 3.9 to be installed, go to [https://www.microsoft.com/en-us/download/confirmation.aspx?id=48159] and download it.
1. Create a new virtual environment using virtualenvwrapper-win. If you don't have it installed, install it by doing `pip install virtualenvwrapper-win`.
    1. After installing virtualenvwrapper-win, create a new  virtual environment by running the command: `mkvirtualenv <type your virtual env name here> --python=<path to Python 396 64 bit exe on your computer>`
    2. Once the virtual environment is created the command line will automatically step into that virtual environment. If it does not, you can switch into that virtual environment by doing `workon <virtual env name that you typed in the step above>`
    3. <b>The rest of the steps listed here require you to be inside the Python virtual environment, so please be sure to do that.</b>
1. Now change directory back to the cloned github project directory
1. Install the remaining packages from the requirement.txt file. Run: `pip install -r requirement.txt`
1. Copy over the following file : `settings.py` from `\\unicorn3\CRI3\Website Revamp Project\settings_misc\rmicri.org` into `<cloned project folder>\project_name`.
1. Run `python manage.py runserver` inside the Python virtual environment to start the Django development server.
1. The development website should be running at `http://127.0.0.1:8000`.
