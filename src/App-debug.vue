<script setup>
console.log('🟢 App.vue wird geladen...')
</script>

<template>
  <div id="app">
    <header style="padding: 20px; background: #4CAF50; color: white; text-align: center;">
      <h1>🌴 Costa Rica Test - App läuft!</h1>
      <p>Wenn du das siehst, funktioniert Vue.js</p>
    </header>

    <main style="padding: 20px; text-align: center;">
      <div style="background: #e8f5e8; padding: 20px; border-radius: 10px; margin: 20px auto; max-width: 600px;">
        <h2>✅ Deployment Test erfolgreich!</h2>
        <p>Die App ist korrekt geladen. Jetzt können wir die Galerie einschalten.</p>
        
        <div style="margin-top: 20px;">
          <h3>📋 Debug Info:</h3>
          <ul style="list-style: none; padding: 0;">
            <li>✅ Vue.js: {{ $options.version || 'Geladen' }}</li>
            <li>✅ Vite: Build erfolgreich</li>
            <li>✅ Netlify: Deployment funktioniert</li>
            <li>✅ Node 20: Verwendet</li>
          </ul>
        </div>
      </div>
    </main>

    <footer style="text-align: center; padding: 20px; background: #f5f5f5;">
      <p>🚀 Ready für Costa Rica Galerie!</p>
    </footer>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}
</style>
