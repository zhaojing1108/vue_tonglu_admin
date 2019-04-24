<template>
  <el-dialog :append-to-body="true" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="标题">
        <el-input v-model="form.title" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="文章链接">
        <el-input v-model="form.url" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="所属分类1：热门活动，2：景区新闻3：旅游新闻">
        <el-input v-model="form.category" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="文章作者">
        <el-input v-model="form.author" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="创建日期">
        <el-input v-model="form.createTime" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="更新日期">
        <el-input v-model="form.updateTime" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="文章内容">
        <el-input v-model="form.content" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="在首页上的简介">
        <el-input v-model="form.description" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="主页上显示">
        <el-input v-model="form.isShow" style="width: 370px;"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/activityInformation'
export default {
  props: {
    isAdd: {
      type: Boolean,
      required: true
    },
    sup_this: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      loading: false,
      dialog: false,
      form: {
        id: '',
        title: '',
        url: '',
        category: '',
        author: '',
        createTime: '',
        updateTime: '',
        content: '',
        description: '',
        isShow: ''
      }
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.loading = true
      if (this.isAdd) {
        this.doAdd()
      } else this.doEdit()
    },
    doAdd() {
      add(this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '添加成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.$parent.$parent.init()
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    doEdit() {
      edit(this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '修改成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.sup_this.init()
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = {
        id: '',
        title: '',
        url: '',
        category: '',
        author: '',
        createTime: '',
        updateTime: '',
        content: '',
        description: '',
        isShow: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
