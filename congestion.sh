echo "Limiting"
# Create a classful queueing discipline of type Hierarchical Token Bucket
tc qdisc add dev eno1 root handle 1: htb default 99
echo $?
# Create a class with rate of 100 mbit
tc class add dev eno1 parent 1: classid 1:99 htb rate 100mbit
echo $?
# Wait until user hits enter
read a
# And cleanup
echo "Deleting"
tc qdisc del dev eno1 root
tc qdisc show
