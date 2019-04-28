<template>
  <div>
    <el-form ref="from" :model="form" class="form-container">
        <!-- 提交按钮部分 -->
        <div style="width：100%;height:60px;background:#cdcdcd;">
            <el-button style="float:right;margin-right:20px;margin-top:10px" type="success" @click="doSubmit" :loading="loading">
            完成文章
            </el-button>
        </div>
        <div style="width:95%;margin:20px auto 0;">
            <el-form-item label="文章标题">
                <el-input  style="width: 370px;" v-model="form.title"/>
            </el-form-item>
            <el-form-item label="文章主图">
                <el-input style="width: 370px;" v-model="form.imgUrl"/>
            </el-form-item>
            <el-form-item label="所属分类">
              <!-- <el-input  style="width: 370px;" placeholder="1：热门活动，2：景区新闻，3：旅游新闻" v-model="form.category"/> -->
              <el-select v-model="form.category" placeholder="请选择文章所属分类"  @change='ssflSelect' style="width:370px">
                <el-option
                  v-for="item in ssflOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="首页简介">
                <el-input style="width: 70%;" v-model="form.description"/>
            </el-form-item>
            <el-form-item label="首页图片">
                <el-upload
                  :before-remove="handleBeforeRemove"
                  :headers="headers"
                  :limit="1"
                  :action="imagesUploadApi"
                  :file-list="images"
                  :data="uploadCangKuParams"
                  :on-success="doimgSubmit"
                  list-type="picture-card">
                  <i class="el-icon-plus"/>
                </el-upload>
            </el-form-item>
            <el-form-item label="是否展示">
                <el-select v-model="form.isShow" placeholder="请选择文章是否展示到列表"  @change='sfzsSelect' style="width:370px">
                  <el-option
                    v-for="item in sfzsOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
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
import { fetchArticle } from '@/api/article'
import { mapGetters } from 'vuex'
import E from 'wangeditor'
import { getToken } from '@/utils/auth'
import { add, edit ,editdetail} from '@/api/activityInformation'
import { del } from '@/api/picture'
//import Warning from './Warning'
//import { CommentDropdown, PlatformDropdown, SourceUrlDropdown } from './Dropdown'
var editor 
const defaultForm = {
    title: '',
    imgUrl:'',
    category: '',
    content: '',
    description: '',
    isShow: '',
    imgUrl:''
}
export default {
  name: 'ArticleDetail',
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
        loading: false,
        dialog: false,
        form: Object.assign({}, defaultForm),
        ssflOptions: [{
          value: '1',
          label: '1：热门活动'
        }, {
          value: '2',
          label: '2：景区新闻'
        }, {
          value: '3',
          label: '3：旅游新闻'
        }],
        sfzsOptions: [{
          value: '0',
          label: '不展示'
        }, {
          value: '1',
          label: '展示'
        }],
        fileList: [],
        pictures: [],
        uploadCangKuParams: {bizType:'WARE_HOUSE_IMAGE'},
        indexImgUrl:'',
        images:[
        ]  
    }
  },
  computed: {
    /*富文本上传图片*/
    ...mapGetters([
      'imagesUploadApi'
    ])
  },
  mounted() {
    /*创建富文本*/
    this.seteditor()
  },
  created() {
    /*判断是编辑还是新增文章*/
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    } else {
      this.form = Object.assign({}, defaultForm)
    }
  },
    methods: {
      //所属分类选择值得变化
      ssflSelect (vId){
        let obj ;
        obj = this.ssflOptions.find((item)=>{//这里的selectList就是上面遍历的数据源
            return item.value === vId;//筛选出匹配数据
        });
        //this.form.category=obj.value
      },
      //是否展示值的变化
      sfzsSelect (vId){
        let obj ;
        obj = this.sfzsOptions.find((item)=>{//这里的selectList就是上面遍历的数据源
            return item.value === vId;//筛选出匹配数据
        });
        //this.form.category=obj.value
      },
      //设置富文本
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
        /*点击编辑，通过id获得后台的值*/
        editdetail(id).then(res => {
          console.log(res)
          //根据id获得的值传给前台
          this.form.title=res.title         
          this.form.imgUrl=res.imgUrl
          console.log(res.title)
          this.form.category=String(res.category) 
          this.form.content=res.content
          this.form.description=res.description
          this.form.isShow=String(res.isShow) 
          this.form.imgUrl=res.imgUrl
          this.images=[{url:res.imgUrl}]
          editor.txt.html(res.content)
        }).catch(err => {
          
        })
      },
      /*点击完成文章*/
      doSubmit() {
            console.log(this.form)
            // 判断内容有没有输入完整
            if(this.form.title===""||this.form.imgUrl===""||this.form.category===""||this.form.author===""||this.form.content===""||this.form.description===""||this.form.isShow===""){
               this.$message({
                  message: '内容没有输入完整',
                  type: 'warning'
               });
              return
            }
            this.loading = true
            this.doAdd()
        },
        /*增加文章执行的操作*/
        doAdd() {
            add(this.form).then(res => {
                this.$notify({
                title: '保存成功',
                type: 'success',
                duration: 2500
                })
                this.resetForm()
                this.loading = false
                this.$parent.$parent.init()
                
            }).catch(err => {
                this.loading = false
                console.log(err.response.data.message)
            })
        },
        //清空表单
        resetForm() {
          editor.txt.html('')
          this.images=[]
          this.form = {
            title: '',
            imgUrl:'',
            category: '',
            content: '',
            description: '',
            isShow: '',
            imgUrl:''
          }
        },
        //删除图片
        handleBeforeRemove(file, fileList) {
          for (let i = 0; i < this.pictures.length; i++) {
            if (this.pictures[i].uid === file.uid) {
              del(this.pictures[i].id).then(res => {})
              return true
            }
          }
          //删除的时候清空form里面imgurl的值
          this.form.imgUrl=""
        },
        //获得主图的链接
        doimgSubmit(file, fileList){
          var a=file.data
          var thisa=a.join()
          this.form.imgUrl=thisa
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
