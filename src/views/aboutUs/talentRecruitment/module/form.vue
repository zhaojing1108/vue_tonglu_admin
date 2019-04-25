<template>
  <el-dialog :append-to-body="true" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="500px" :close-on-click-modal="false">
    <el-form ref="form" :model="form" size="small" label-width="80px">
      <el-form-item label="发布时间">
        <el-input v-model="form.updateTime" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="职位名称">
        <el-input v-model="form.positionName" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="地址">
        <el-input v-model="form.address" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="职位类别">
        <el-input v-model="form.categories" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="内容">
        <el-input v-model="form.content" style="width: 370px;"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/talentRecruitment'
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
      loading: false, dialog: false,
      form: {
        id: '',
        updateTime: '',
        positionName: '',
        address: '',
        categories: '',
        content: ''
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
        updateTime: '',
        positionName: '',
        address: '',
        categories: '',
        content: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
