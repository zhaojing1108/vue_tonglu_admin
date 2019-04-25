<template>
<article-detail :is-edit="true" />
</template>

<script>
import ArticleDetail from './module/ArticleDetail'
export default {
  name: 'EditForm',
  components: { ArticleDetail },
}

</script>

