<template>
  <div>
    <el-form ref="from" :model="form" class="form-container">
        <!-- 提交按钮部分 -->
        <div style="width：100%;height:60px;background:#cdcdcd;">
            <el-button style="float:right;margin-right:20px;margin-top:10px" type="success" @click="doSubmit" :loading="loading">
            完成职位
            </el-button>
        </div>
        <div style="width:95%;margin:20px auto 0;">
            <el-form-item label="职位名称">
                <el-input  style="width: 370px;" v-model="form.positionName"/>
            </el-form-item>
            <el-form-item label="职位地址">
              <el-input style="width: 70%;" v-model="form.address"/>
            </el-form-item>
            <el-form-item label="职位类别">
                <el-input style="width: 70%;" v-model="form.categories"/>
            </el-form-item>
            <div ref="editor" style="text-align:left;margin: 5px" :value="form.content">
                    
            </div>
        </div>
    </el-form>
  </div>
</template>

<script>
import MDinput from '@/components/MDinput'
import { validURL } from '@/utils/validate'
import { mapGetters } from 'vuex'
import E from 'wangeditor'
import { add, edit, editdetail} from '@/api/talentRecruitment'
import { fetchArticle } from '@/api/article'
import { getToken } from '@/utils/auth'
//import Warning from './Warning'
//import { CommentDropdown, PlatformDropdown, SourceUrlDropdown } from './Dropdown'
var editor 
const defaultForm = {
    id: '',
    positionName: '',
    address: '',
    categories: '',
    content: ''
}
export default {
  name: 'WorkDetail',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
      return {
        headers: {
          'Authorization': 'Bearer ' + getToken()
        },
        detailId:[],
        loading: false,
        dialog: false,
        form: Object.assign({}, defaultForm),
      }
  },
  computed: {
    /*富文本上传图片*/
    ...mapGetters([
      'imagesUploadApi'
    ])
  },
  created() {
  //这边接收上个组件传递过来的arry数组，赋值给data中定义的workTask
    this.detailId = this.$route.query.id;
    /*判断是编辑还是新增文章*/
    if (this.isEdit) {
      const id = this.detailId
      this.fetchData(id)
    } else {
      this.form = Object.assign({}, defaultForm)
    }
  },
  mounted() {
    /*创建富文本*/
    this.seteditor()
  },
  methods: {
     seteditor () {
          editor = new E(this.$refs.editor)
          editor.customConfig.uploadImgShowBase64 = true // 使用 base64 保存图片
          // 不可修改
          editor.customConfig.uploadImgHeaders = this.headers
          // 自定义文件名，不可修改，修改后会上传失败
          editor.customConfig.uploadFileName = 'file'
          editor.customConfig.uploadImgServer = this.imagesUploadApi // 上传图片到服务器
          editor.customConfig.onchange = (html) => {
            this.editorContent = html
            this.form.content= this.editorContent
          }
          editor.create()
      },
      fetchData(id) {
         editdetail(id).then(res => {
           this.form.id=res.id
          //根据id获得的值传给前台
           this.form.positionName=res.positionName
           this.form.address=res.address
           this.form.categories=res.categories
           editor.txt.html(res.content)
        }).catch(err => {
          
        })
      },
      /*点击完成文章*/
      doSubmit() {
          // 判断内容有没有输入完整
          console.log(this.form)
          if(this.form.positionName===""||this.form.address===""||this.form.categories===""||this.form.content===""){
              this.$message({
                message: '内容没有输入完整',
                type: 'warning'
              });
            return
          }
          this.loading = true
          
          if (this.isAdd) {
            this.doAdd()
          } else this.doEdit()
      },
      /*增加文章执行的操作*/
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
       //清空表单
      resetForm() {
        editor.txt.html('')
        this.form = {
          title: '',
          category: '',
          content: '',
          description: '',
          isShow: ''
        }
      }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 40px 45px 20px 50px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}

.article-textarea /deep/ {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}
</style>
