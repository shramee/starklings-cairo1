# Utiliza la imagen base de Ubuntu
FROM ubuntu:latest

# Actualiza el repositorio y instala dependencias necesarias
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Instala Node.js y npm
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get install -y nodejs

# Instala Rust usando rustup
RUN curl https://sh.rustup.rs -sSf | sh -s -- -y

# Agrega Rust a PATH
ENV PATH="/root/.cargo/bin:${PATH}"

# Confirma la instalación de Rust y muestra la versión
RUN rustc --version

# install Scarb
RUN curl --proto '=https' --tlsv1.2 -sSf https://docs.swmansion.com/scarb/install.sh | bash -s -- -v 2.6.3
ENV PATH="/root/.local/bin:${PATH}"

#Specify a working directory
WORKDIR /usr/app

#Copy the dependencies file
COPY ./package.json ./

#Install dependencies
RUN npm install 

#Copy remaining files
COPY ./ ./

EXPOSE 3000

#Default command
CMD ["npm","start"]
