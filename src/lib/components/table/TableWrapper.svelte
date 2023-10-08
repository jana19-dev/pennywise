<script>
  export let noBorder = false
</script>

<div class="inline-block min-w-full align-middle">
  <div class="relative rounded-md ring-black ring-opacity-5" class:ring-0={noBorder} class:ring-1={!noBorder} class:shadow-sm={!noBorder}>
    <table class="min-w-full border-separate" style="border-spacing: 0">
      <thead class="bg-gray-50">
        <slot name="header" />
      </thead>

      <tbody class="bg-white"><slot /></tbody>
    </table>
  </div>
</div>
