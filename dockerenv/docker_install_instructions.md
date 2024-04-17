# Docker installation instructions

1. Install [docker desktop](https://www.docker.com/products/docker-desktop/).
2. Open the `LenaSYS/dockerenv` directory/folder in the terminal.
3. Run the command: `docker compose up -d` to setup and start the containers.
4. Navigate to [localhost/LenaSYS/install/install.php](http://localhost/LenaSYS/install/install.php).
5. Navigate through the installer (On the first page the correct info should be present). `password` is the default mysql root password in this config.

### Using linux or mac?
Make sure you set the appropriate file permissions for LenaSYS. The easisest way to do this is to run the command `sudo chmod -R 777 LenaSYS`.
After chaning the file permissions recursively over the repository, all the files may show up as changes. To fix this, run `git config core.fileMode false` in the root of the repository.
