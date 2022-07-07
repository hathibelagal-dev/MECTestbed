tc qdisc add dev $1 root netem rate 100mbit loss 5%
tc qdisc show
read a
tc qdisc del dev $1 root
tc qdisc show
