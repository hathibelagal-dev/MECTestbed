# Create and run container for application A1
sudo docker build -f Dockerfile -t basic-v2x:0.1 .
time sudo docker run -d --name testa basic-v2x:0.1

# Create and run container for application A2, after
# creating a volume for it
sudo docker volume create some-state-volume
sudo docker build -f Dockerfile -t some-state-v2x:0.1 .
time sudo docker run -d -i --name testb --mount source=some-state-volume,target=/data -p 8080:3000 some-state-v2x:0.1
# Restart container for testing
sudo docker start -i testb

# Create and run container for application A3
sudo docker build -f Dockerfile -t full-state-live-v2x:0.1 .
time sudo docker run -d -p 3000:11211 --name testc full-state-live-v2x:0.1