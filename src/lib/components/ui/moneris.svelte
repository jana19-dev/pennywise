<script>
  const onSendPreloadRequest = () => {
    fetch(`https://gatewayt.moneris.com/chktv2/request/request.php`, {
      method: `POST`,
      headers: {
        "Content-Type": `application/json`,
        Accept: `application/json`
      },
      body: JSON.stringify({
        store_id: `store1`,
        api_token: `yesguy1`,
        checkout_id: `chktP4TYXtore1`,
        environment: `qa`,
        action: `preload`,
        txn_total: `22.50`,
        order_no: new Date().getTime(),
        cust_id: `chul`,
        dynamic_descriptor: `oh no`
      })
    })
    // .then((response) => response.json())
    // .then((data) => {
    //   console.log(`Success:`, data)
    //   const ticket = data.ticket
    //   console.log(ticket)

    //   var myCheckout = new monerisCheckout()
    //   myCheckout.setMode(`qa`)
    //   myCheckout.setCheckoutDiv(`monerisCheckout`)

    //   myCheckout.startCheckout(ticket)
    // })
  }
</script>

<svelte:head>
  <script src="https://gatewayt.moneris.com/chkt/js/chkt_v1.00.js"></script>
</svelte:head>

<button on:click={onSendPreloadRequest}>preload request</button>

<div id="monerisCheckout">sds</div>
