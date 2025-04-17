# Docker installation instructions

1. Press this link: [docker desktop](https://www.docker.com/products/docker-desktop/).

2. In the Docker website press "chosse plan"-button.
![Docker homepage](homepage.png "Docker homepage")

3. Chosse Docker Personal.
![Choose plan](choosePlan.png "Choose plan")

4. Press "Continue with GitHub"-button.
![Press continue github account](createAccount.png "continue github account")

5. Sign in with your school-email and password.
![Sign in github](github.png "Sign in github")

6. Now you are in Docker Home and press the "Go to download"-button. 
![Docker Home](docker_home.png "Docker Home")

7. Select which operating software (OS) that you are using.
![Operating software](os.png "Operating software")

8. When you have selected OS and installed your OS, then open a Docker desktop program/app.

9. Congratulations, now you have installed the Docker desktop! 
![Docker desktop](dockerDesktop.png "Docker desktop")


2. Open the `LenaSYS/dockerenv` directory/folder in the terminal.
3. Run the command: `docker compose up -d` to setup and start the containers.
4. Navigate to [localhost/LenaSYS/install/install.php](http://localhost/LenaSYS/install/install.php).
5. Navigate through the installer (On the first page the correct info should be present). `password` is the default mysql root password in this config.

### Using linux or mac?
Make sure you set the appropriate file permissions for LenaSYS. The easisest way to do this is to run the command `sudo chmod -R 777 LenaSYS`.
After chaning the file permissions recursively over the repository, all the files may show up as changes. To fix this, run `git config core.fileMode false` in the root of the repository.
