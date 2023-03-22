<script>
  export let category

  import TableCell from "$lib/components/table/TableCell.svelte"

  import DeleteCategory from "$lib/components/application/category/mutations/DeleteCategory.svelte"
  import UpdateCategoryName from "$lib/components/application/category/mutations/update/UpdateCategoryName.svelte"
</script>

<tr class="h-10">
  <TableCell>
    <DeleteCategory {category} />
  </TableCell>
  <TableCell>
    <UpdateCategoryName {category} isInline />
  </TableCell>
</tr>
