<template>
  <div class="payment-container">
    <div id="paypal-button-container" class="paypal-button-container"></div>
    <button @click="cancel" class="cancel-button">Cancel</button>
  </div>
</template>

<script>
export default {
  name: "PlacanjeView",
  data() {
    return {};
  },
  methods: {
    // Cancel button handler
    cancel() {
      this.$router.push("/korpa");
    },
    // PayPal buttons configuration
    initializePayPalButton() {
      window.paypal
        .Buttons({
          style: {
            layout: "vertical",
            color: "blue",
          },
        })
        .render("#paypal-button-container");
    },
  },
  mounted() {
    // Initialize the PayPal button on component mount
    this.initializePayPalButton();
  },
};
</script>

<style scoped>
.payment-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.paypal-button-container {
  background-color: rgba(92, 171, 224, 0.363);
  max-height: 400px;
  overflow-y: auto;
  width: 400px;
  padding: 100px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.cancel-button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #ff6347;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.cancel-button:hover {
  background-color: #ff3b20;
}
</style>
