<template>
  <el-dialog :append-to-body="true" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="500px" :close-on-click-modal="false">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="广告标题" prop="title">
        <el-input v-model="form.title" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="简介内容" prop="content">
        <el-input v-model="form.content" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="广告链接" prop="url">
        <el-input v-model="form.url" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="图片链接" prop="imgUrl">
        <el-input v-model="form.imgUrl" style="width: 370px;"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit('form')">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/ad'
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
        title: '',
        content: '',
        url: '',
        imgUrl: ''
      },
      rules:{
        title:[{required:true,message:"请输入广告标题",trigger:"blur"}],
        content:[{required:true,message:"请输入广告内容",trigger:"blur"}],
        url:[{required:true,message:"请输入广告链接地址",trigger:"blur"}],
        imgUrl:[{required:true,message:"请输入广告图片地址",trigger:"blur"}],
      }
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    doSubmit(formName) {
      this.$refs[formName].validate((valid)=>{
        if(valid){
          this.loading = true;
          if(this.isAdd){
            this.doAdd()
          }else{this.doEdit();}
        }
      })
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
        content: '',
        url: '',
        imgUrl: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
