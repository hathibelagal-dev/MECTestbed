tc qdisc add dev lo root netem rate 100mbit loss 5%
tc qdisc show
read a
tc qdisc del dev lo root
tc qdisc show
